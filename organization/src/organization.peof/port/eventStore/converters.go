package eventStore

import (
	"organization.peof/domain"
)

func toEventLog(event domain.Event) mongoEventLog {
	log := mongoEventLog{
		Event:       event,
		AggregateId: event.Root().AggregateId,
		Timestamp:   event.Root().Timestamp}
	return log
}

func toEventLogs(events []domain.Event) []interface{} {
	logs := make([]interface{}, len(events))
	for i, v := range events {
		logs[i] = toEventLog(v)
	}
	return logs
}
