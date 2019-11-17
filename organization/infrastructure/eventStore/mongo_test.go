package eventStore

import (
	"context"
	"fmt"
	"github.com/gofrs/uuid"
	"github.com/ory/dockertest"
	"github.com/paulvitic/peof/organization/domain"
	"github.com/paulvitic/peof/organization/infrastructure"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
	"os"
	"strings"
	"testing"
	"time"
)

const (
	createdCompany     = "createdCompany"
	updatedCompany     = "updatedCompany"
	newName            = "newName"
	nonExistingCompany = "nonExistingCompany"
)

var resource *dockertest.Resource
var pool *dockertest.Pool

var store *MongoEventStore

// test fixtures
var createdCompanyId string
var updatedCompanyId string
var nonExistingCompanyId string

func TestMain(m *testing.M) {

	// set up fixtures
	createdCompanyId = fmt.Sprintf("%x", uuid.NewV5(uuid.NamespaceDNS, createdCompany))
	updatedCompanyId = fmt.Sprintf("%x", uuid.NewV5(uuid.NamespaceDNS, updatedCompany))
	nonExistingCompanyId = fmt.Sprintf("%x", uuid.NewV5(uuid.NamespaceDNS, nonExistingCompany))

	var err error
	var client *mongo.Client

	// get test configuration
	err = os.Chdir("../../../..")
	if err != nil {
		log.Fatalf("Error while changing directory: %s", err)
	}

	profile := os.Getenv("PROFILE")
	if profile != "" {
		profile = strings.ToLower(profile)
	} else {
		profile = "test"
	}

	log.Printf("[info] starting in %s profile", profile)

	cnf, errs := infrastructure.NewConfig(profile)
	if errs != nil {
		log.Fatalf("Error while changing directory: %v", err)
	}

	// uses a sensible default on windows (tcp/http) and linux/osx (socket)
	if cnf.Profile == "test" {
		pool, err = dockertest.NewPool("")
		if err != nil {
			log.Fatalf("Could not connect to docker: %s", err)
		}

		// build container
		resource, err = pool.BuildAndRun(
			"mongo-test-db",
			"../mongoDb/Dockerfile",
			[]string{})
		if err != nil {
			endTest(err)
		}

		// exponential backoff-retry, because the application in the container might not be ready to accept connections yet
		if err := pool.Retry(func() error {
			var err error

			uri := fmt.Sprintf("%s:%s/%s", cnf.MongoDb.Uri, resource.GetPort("27017/tcp"), dbName)
			clientOptions := options.Client().ApplyURI(uri)

			ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
			defer cancel()

			client, err = mongo.Connect(ctx, clientOptions)
			if err != nil {
				return err
			}

			// Check the connection
			ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
			return client.Ping(ctx, nil)

		}); err != nil {
			endTest(err)
		}
	} else {
		var err error

		log.Printf("connecting to mongo at %s", cnf.MongoDb.Uri)
		clientOptions := options.Client().ApplyURI(cnf.MongoDb.Uri)

		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		client, err = mongo.Connect(ctx, clientOptions)
		if err != nil {
			endTest(err)
		}

		// Check the connection
		ctx, cancel = context.WithTimeout(context.Background(), 10*time.Second)
		err = client.Ping(ctx, nil)
		if err != nil {
			endTest(err)
		}
	}

	// Get a handle for your collection
	store = &MongoEventStore{
		db: client.Database(dbName),
	}

	// run the test
	code := m.Run()

	if cnf.Profile == "test" {
		// You can't defer this because os.Exit doesn't care for defer
		if err := pool.Purge(resource); err != nil {
			log.Fatalf("Could not purge resource: %s", err)
		}
	}

	os.Exit(code)
}

func TestEventStore_Append(t *testing.T) {
	type args struct {
		events        []domain.Event
		aggregateType string
	}

	tests := []struct {
		name    string
		args    args
		wantErr bool
	}{
		{
			name: "shouldAppendDomainEvent",
			args: args{
				events: []domain.Event{
					domain.CompanyCreated{
						EventRoot: domain.EventRoot{
							EventType:   domain.CompanyCreatedEvent,
							Version:     1.0,
							Timestamp:   10,
							AggregateId: createdCompanyId},
						CompanyName: createdCompany}},
				aggregateType: domain.CompanyAggregate},
		},
		{
			name: "shouldAppendMultipleDomainEvents",
			args: args{
				events: []domain.Event{
					domain.CompanyNameChanged{
						EventRoot: domain.EventRoot{
							EventType:   domain.CompanyNameChangedEvent,
							Version:     1.0,
							Timestamp:   12,
							AggregateId: updatedCompanyId},
						CompanyName: newName},
					domain.CompanyCreated{
						EventRoot: domain.EventRoot{
							EventType:   domain.CompanyCreatedEvent,
							Version:     1.0,
							Timestamp:   11,
							AggregateId: updatedCompanyId},
						CompanyName: updatedCompany},
				},

				aggregateType: domain.CompanyAggregate},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if err := store.Append(tt.args.events, tt.args.aggregateType); (err != nil) != tt.wantErr {
				t.Errorf("MongoEventStore.Append() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestEventStore_EventsOf(t *testing.T) {

	type args struct {
		aggregateId   string
		aggregateType string
	}

	tests := []struct {
		name       string
		args       args
		wantEvents []map[string]interface{}
		wantErr    bool
	}{
		{
			name: "shouldRetrieveSingleEvent",
			args: args{aggregateId: createdCompanyId, aggregateType: domain.CompanyAggregate},
			wantEvents: []map[string]interface{}{
				{
					domain.EventTypeKey:      domain.CompanyCreatedEvent,
					domain.EventVersionKey:   1.0,
					domain.EventTimestampKey: 10,
					domain.AggregateIdKey:    createdCompanyId,
					"companyName":            createdCompany,
				},
			},
		},
		{
			name: "shouldRetrieveAllEventsInOrder",
			args: args{aggregateId: updatedCompanyId, aggregateType: domain.CompanyAggregate},
			wantEvents: []map[string]interface{}{
				{
					domain.EventTypeKey:      domain.CompanyCreatedEvent,
					domain.EventVersionKey:   1.0,
					domain.EventTimestampKey: 11,
					domain.AggregateIdKey:    updatedCompanyId,
					"companyName":            updatedCompany,
				},
				{
					domain.EventTypeKey:      domain.CompanyNameChangedEvent,
					domain.EventVersionKey:   1.0,
					domain.EventTimestampKey: 12,
					domain.AggregateIdKey:    updatedCompanyId,
					"companyName":            updatedCompany,
				},
			},
		},
		{
			name: "shouldNotFindEvents",
			args: args{aggregateId: nonExistingCompanyId, aggregateType: domain.CompanyAggregate},
		},
		{
			name: "shouldNotFindAggregateType",
			args: args{aggregateId: nonExistingCompanyId, aggregateType: "nonExistingAggregate"},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err, gotEvents := store.EventsOf(tt.args.aggregateId, tt.args.aggregateType)
			if (err != nil) != tt.wantErr {
				t.Errorf("MongoEventStore.EventsOf() error = %v, wantErr %v", err, tt.wantErr)
				return
			}

			if strings.Compare(tt.name, "shouldRetrieveSingleEvent") == 0 {
				if len(gotEvents) != 1 {
					t.Errorf("MongoEventStore.EventsOf() = %d, want %d", len(gotEvents), 1)
				}
				if gotEvents[0][domain.EventTypeKey] != tt.wantEvents[0][domain.EventTypeKey] {
					t.Errorf("MongoEventStore.EventsOf() = %v, want %v", gotEvents[0], tt.wantEvents[0])
				}
			}

			if strings.Compare(tt.name, "shouldRetrieveAllEventsInOrder") == 0 {
				if len(gotEvents) != 2 {
					t.Errorf("MongoEventStore.EventsOf() = %d, want %d", len(gotEvents), 2)
				}

				if gotEvents[0][domain.EventTypeKey] != tt.wantEvents[0][domain.EventTypeKey] {
					t.Errorf("MongoEventStore.EventsOf() = %v, want %v", gotEvents[0], tt.wantEvents[0])
				}

				if gotEvents[1][domain.EventTypeKey] != tt.wantEvents[1][domain.EventTypeKey] {
					t.Errorf("MongoEventStore.EventsOf() = %v, want %v", gotEvents[1], tt.wantEvents[1])
				}
			}

			if strings.Compare(tt.name, "shouldNotFindEvents") == 0 ||
				strings.Compare(tt.name, "shouldNotFindAggregateType") == 0 {

				if len(gotEvents) != 0 {
					t.Errorf("MongoEventStore.EventsOf() = %d, want %d", len(gotEvents), 0)
				}
			}
		})
	}
}

func endTest(err error) {
	if err != nil {
		log.Printf("[error] while testing: %s", err)
	}
	if err := pool.Purge(resource); err != nil {
		log.Fatalf("Could not purge resource: %s", err)
	}
}
