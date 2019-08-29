package message

import (
	"encoding/json"
	"fmt"
	"github.com/gofrs/uuid"
	"github.com/ory/dockertest"
	"github.com/paulvitic/peof/organization/config"
	"github.com/paulvitic/peof/organization/domain"
	"github.com/streadway/amqp"
	"io"
	"log"
	"os"
	"strings"
	"testing"
	"time"
)

const (
	updatedCompany = "updatedCompany"
	defaultProfile = "test"
)

var resource *dockertest.Resource
var pool *dockertest.Pool

// test fixtures
var updatedCompanyId string
var cnf *config.Configuration

var incoming = make(chan domain.Event)
var publisher *AmqpEventPublisher

func TestMain(m *testing.M) {

	setUpTestFixtures()

	configureTest()

	var url string

	if cnf.Profile == defaultProfile {
		url = initTestContainers()

	} else {
		url = cnf.RabbitMQ.Url
		log.Printf("[info] connecting to rabbitMQ at %s", url)

		conn, err := amqp.Dial(url)
		if err != nil {
			endTest(err)
		}
		closeWhenDone(conn)

		ch, err := conn.Channel()
		if err != nil {
			endTest(err)
		}
		closeWhenDone(ch)
	}

	publisher = NewAmqpEventPublisher(url)

	// start consumer
	done := make(chan bool, 1)
	go consume(incoming, done)

	// run the test
	code := m.Run()

	// signal to consumer to stop
	done <- true

	if cnf.Profile == defaultProfile {
		// You can't defer this because os.Exit doesn't care for defer
		if err := pool.Purge(resource); err != nil {
			log.Fatalf("Could not purge resource: %s", err)
		}
	}
	os.Exit(code)
}

func initTestContainers() string {
	var err error

	// uses a sensible default on windows (tcp/http) and linux/osx (socket)
	pool, err = dockertest.NewPool("")
	if err != nil {
		log.Fatalf("Could not connect to docker: %s", err)
	}
	pool.MaxWait = time.Second * 20

	// build container
	resource, err = pool.RunWithOptions(&dockertest.RunOptions{
		Repository: "rabbitmq",
		Tag:        "3",
		Name:       "peof-rabbiMQ-test",
		Env: []string{
			"RABBITMQ_DEFAULT_USER=guest",
			"RABBITMQ_DEFAULT_PASS=guest",
			"RABBITMQ_DEFAULT_VHOST=/",
		},
	})
	if err != nil {
		endTest(err)
	}

	var url string

	if err := pool.Retry(func() error {
		var err error

		url = fmt.Sprintf("%s:%s/", cnf.RabbitMQ.Url, resource.GetPort("5672/tcp"))
		log.Printf("[info] waiting for rabbitMQ at %s", url)

		conn, err := amqp.Dial(url)
		if err != nil {
			return err
		}
		closeWhenDone(conn)

		ch, err := conn.Channel()
		if err != nil {
			return err
		}
		closeWhenDone(ch)

		return nil

	}); err != nil {
		endTest(err)
	}

	return url
}

func TestAmqpEventPublisher_Dispatch(t *testing.T) {
	type fields struct {
		queueName     string
		mandatorySend bool
	}
	type args struct {
		events []domain.Event
	}
	tests := []struct {
		name    string
		fields  fields
		args    args
		wantErr bool
	}{
		{
			name: "shouldPublish",
			fields: fields{
				queueName:     domain.CompanyAggregate,
				mandatorySend: false,
			},
			args: args{
				events: []domain.Event{
					domain.CompanyCreated{
						EventRoot: domain.EventRoot{
							EventType:   domain.CompanyCreatedEvent,
							Version:     1.1,
							Timestamp:   123456789,
							AggregateId: updatedCompanyId},
						CompanyName: updatedCompany},
				},
			},
			wantErr: false,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := publisher.Dispatch(tt.args.events)
			if (err != nil) != tt.wantErr {
				t.Errorf("AmqpEventPublisher.Dispatch() error = %v, wantErr %v", err, tt.wantErr)
			}

			want := <-incoming
			if tt.args.events[0] != want {
				t.Errorf("MongoEventStore.EventsOf() = %v, want %v", tt.args.events[0], want)
			}
		})
	}
}

func configureTest() {
	profile := os.Getenv("PROFILE")
	if profile != "" {
		profile = strings.ToLower(profile)
	} else {
		profile = defaultProfile
	}

	// get test configuration
	err := os.Chdir("../../../..")
	if err != nil {
		log.Fatalf("Error while changing directory: %s", err)
	}

	var errs []error
	cnf, errs = config.NewConfig(profile)
	if errs != nil {
		log.Fatalf("Error getting test configuration: %v", err)
	}
}

func setUpTestFixtures() {
	// set up fixtures
	updatedCompanyId = fmt.Sprintf("%x", uuid.NewV5(uuid.NamespaceDNS, updatedCompany))
}

func consume(incoming chan domain.Event, done chan bool) {

	msgs, err := publisher.channel.Consume(
		publisher.queue.Name, // queue
		"",                   // consumer
		true,                 // auto-ack
		false,                // exclusive
		false,                // no-local
		true,                 // no-wait
		nil,                  // args
	)
	if err != nil {
		log.Fatalf("could not start consuming: %s", err)
	}

	go func(incoming chan domain.Event, done chan bool) {
		for {
			select {
			case <-done:
				log.Printf("[info] shutting down consumer")
				close(incoming)
				return
			default:
				for msg := range msgs {
					b := []byte(msg.Body)
					switch msg.Headers[domain.EventTypeKey] {
					case domain.CompanyCreatedEvent:
						var m domain.CompanyCreated
						_ = json.Unmarshal(b, &m)
						log.Printf("[info] received event %v", m)
						incoming <- m
						return
					case domain.CompanyNameChangedEvent:
						var m domain.CompanyNameChanged
						_ = json.Unmarshal(b, &m)
						log.Printf("[info] received event %v", m)
						incoming <- m
						return
					default:
						log.Printf("[warn] event type %s not recognized", msg.Headers[domain.EventTypeKey])
					}
				}
			}
		}
	}(incoming, done)
}

func closeWhenDone(target io.Closer) func() {
	return func() {
		err := target.Close()
		if err != nil {
			log.Printf("[error] while closing io %s", err.Error())
		}
	}
}

func endTest(err error) {
	if cnf.Profile == defaultProfile {
		if err != nil {
			log.Printf("[error] while testing: %s", err)
		}
		if err := pool.Purge(resource); err != nil {
			log.Fatalf("Could not purge resource: %s", err)
		}
	} else {
		if err != nil {
			log.Fatalf("[error] while testing: %s", err)
		}
	}
}
