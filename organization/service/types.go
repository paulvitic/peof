package service

import (
	"github.com/paulvitic/peof/organization/domain"
	"log"
)

const (
	company = "company"
)

// document
type applicationService struct {
	eventPublisher domain.EventPublisher
	eventStore     domain.EventStore
}

// document
func (a *applicationService) registerEventsFor(aggregate domain.Aggregate, aggregateType string) error {
	if err := a.eventStore.Append(aggregate.Events(), aggregateType); err != nil {
		return err
	} else {
		if err := a.eventPublisher.Dispatch(aggregate.Events()); err != nil {
			// FIXME needs to be atomic, if event can not be published remove event from event log and return error
			return err
		}
	}
	return nil
}

// document
func (a *applicationService) eventsOf(aggregateId string, aggregateType string) (err error, events []domain.Event) {
	err, mapEvents := a.eventStore.EventsOf(aggregateId, aggregateType)
	if err != nil {
		return
	}

	for _, mapEvent := range mapEvents {
		switch mapEvent[domain.EventTypeKey] {
		case domain.CompanyCreatedEvent:
			m := domain.CompanyCreated{}
			events = append(events, m.FromMap(mapEvent))
			return
		case domain.CompanyNameChangedEvent:
			m := domain.CompanyNameChanged{}
			events = append(events, m.FromMap(mapEvent))
			return
		default:
			log.Printf("[warn] event type %s not recognized", mapEvent[domain.EventTypeKey])
		}
	}
	return
}

// document
func (a *applicationService) noPreviousEventsFor(aggregateId string, aggregateType string) (err error, res bool) {
	if err, events := a.eventsOf(aggregateId, aggregateType); err != nil {
		return err, false
	} else {
		res = len(events) > 0
	}
	return
}
