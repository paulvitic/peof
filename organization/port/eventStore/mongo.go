package eventStore

import (
	"context"
	"github.com/paulvitic/peof/organization/config"
	"github.com/paulvitic/peof/organization/domain"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
	"time"
)

func NewMongoEventStore(config *config.Configuration) (eventStore *MongoEventStore) {
	uri := config.MongoDb.Uri
	clientOptions := options.Client().ApplyURI(uri)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatalf("[error] while connecting %#v", err)
	}

	// Check the connection
	ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
	if err = client.Ping(ctx, nil); err != nil {
		log.Fatalf("[error] while testing connection %#v", err)
	}

	log.Println("[info] connected to MongoDB!")

	// Get a handle for your collection
	eventStore = &MongoEventStore{
		db: client.Database(dbName),
	}
	return
}

// Appends to events of a company
func (s *MongoEventStore) Append(events []domain.Event, aggregateType string) (err error) {

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	insertManyResult, err := s.db.Collection(aggregateType).InsertMany(ctx, toEventLogs(events))
	if err != nil {
		log.Printf("[error] while appending company event %v", err)
	}
	log.Printf("[info] inserted multiple documents: %s", insertManyResult.InsertedIDs)
	return
}

// GetEvent retrieves the most recent event for a given drone.
func (s *MongoEventStore) EventsOf(aggregateId string, aggregateType string) (err error, events []map[string]interface{}) {

	var filter = bson.D{{
		Key:   aggregateIdKey,
		Value: aggregateId,
	}}
	// Sort by `timestamp` field descending
	sort := options.Find()
	sort.SetSort(bson.D{{Key: "timestamp", Value: 1}})

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// find documents
	cur, err := s.db.Collection(aggregateType).Find(ctx, filter, sort)
	if err != nil {
		log.Printf("[error] while querying events: %+v", err)
		return
	}

	// Iterate through the cursor
	for cur.Next(ctx) {
		var eventLog mongoEventLog
		err = cur.Decode(&eventLog)
		if err != nil {
			log.Printf("[error] while decoding event log %v", err)
			return
		}

		m := eventLog.Event.(primitive.D).Map()

		events = append(events, m)
	}

	if err = cur.Err(); err != nil {
		log.Printf("[error] while iterating events: %+v", err)
		return
	}

	// Close the cursor once finished
	_ = cur.Close(ctx)

	log.Printf("[info] found events: %+v", events)

	return
}
