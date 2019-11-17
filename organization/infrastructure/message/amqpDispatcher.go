package message

import (
	"encoding/json"
	"github.com/paulvitic/peof/organization/domain"
	"github.com/streadway/amqp"
	"log"
)

// AmqpEventPublisher is used as anchor for dispatch messsage method for real
// AMQP channels
type AmqpEventPublisher struct {
	channel       *amqp.Channel
	queue         amqp.Queue
	mandatorySend bool
}

// NewAmqpEventPublisher returns a new AMQP dispatcher wrapped around a single
// publishing channel.
func NewAmqpEventPublisher(url string) *AmqpEventPublisher {
	log.Printf("[info] event publisher using URL %s for RabbitMQ", url)

	conn, err := amqp.Dial(url)
	failOnError(err, "failed to connect to RabbitMQ")

	ch, err := conn.Channel()
	failOnError(err, "failed to open a channel")

	q, err := ch.QueueDeclare(
		domain.CompanyAggregate, // name
		true,                    // durable
		false,                   // delete when unused
		false,                   // exclusive
		false,                   // no-wait
		nil,                     // arguments
	)
	failOnError(err, "failed to declare a queue")

	return &AmqpEventPublisher{
		channel:       ch,
		queue:         q,
		mandatorySend: false,
	}
}

// DispatchMessage implementation of dispatch message interface method
func (q *AmqpEventPublisher) Dispatch(events []domain.Event) (err error) {
	for _, event := range events {
		body, err := json.Marshal(event)
		if err != nil {
			log.Printf("[error] failed to marshal message %v (%s)\n", event, err)
			return err
		}

		err = q.channel.Publish(
			"",              // exchange
			q.queue.Name,    // routing key
			q.mandatorySend, // mandatory
			false,           // immediate
			amqp.Publishing{
				ContentType: "text/plain",
				Body:        []byte(body),
				Headers:     map[string]interface{}{"eventType": event.Root().EventType},
			})
		if err != nil {
			log.Printf("[error] failed to publish message %v (%s)\n", event, err)
			return err
		}

		log.Printf("[info] published event %v", event)
	}

	return
}

func failOnError(err error, msg string) {
	if err != nil {
		log.Printf("[error] %s: %s", msg, err)
	}
}
