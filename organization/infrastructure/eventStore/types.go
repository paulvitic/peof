package eventStore

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

const (
	dbName         = "organization"
	aggregateIdKey = "aggregateId"
)

// MongoEventStore is the anchor struct for mongoDB repository implementation methods.
type MongoEventStore struct {
	db *mongo.Database
}

type mongoEventLog struct {
	RecordId    primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	AggregateId string             `bson:"aggregateId"`
	Timestamp   int64              `bson:"timestamp"`
	Event       interface{}        `bson:"event" json:"event"`
}
