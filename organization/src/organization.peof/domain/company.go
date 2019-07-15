package domain

import (
	"fmt"
	"github.com/gofrs/uuid"
	"time"
)

const (
	CompanyAggregate        = "company"
	CompanyCreatedEvent     = "peof.organization.CompanyCreated"
	CompanyNameChangedEvent = "peof.organization.CompanyNameChanged"
)

type Company struct {
	events []Event
	Id     string
	Name   string
}

func (c *Company) Events() []Event {
	return c.events
}

type CompanyCreated struct {
	EventRoot   `bson:",inline"`
	CompanyName string `bson:"companyName" json:"companyName"`
}

func (e CompanyCreated) Root() EventRoot {
	return e.EventRoot
}

func (e CompanyCreated) FromMap(mapEvent map[string]interface{}) Event {
	eventRoot := EventRoot{}
	e.EventRoot = eventRoot.FromMap(mapEvent).(EventRoot)
	e.CompanyName = mapEvent["companyName"].(string)
	return e
}

type CompanyNameChanged struct {
	EventRoot   `bson:",inline"`
	CompanyName string `bson:"companyName" json:"companyName"`
}

func (e CompanyNameChanged) Root() EventRoot {
	return e.EventRoot
}

func (e CompanyNameChanged) FromMap(mapEvent map[string]interface{}) Event {
	eventRoot := EventRoot{}
	e.EventRoot = eventRoot.FromMap(mapEvent).(EventRoot)
	e.CompanyName = mapEvent["companyName"].(string)
	return e
}

func (c *Company) From(events []Event) *Company {
	for _, event := range events {
		switch event.Root().EventType {
		case CompanyCreatedEvent:
			c.created(event.(CompanyCreated))
		case CompanyNameChangedEvent:
			c.nameChanged(event.(CompanyNameChanged))
		default:
			// do nothing
		}
	}
	return c
}

func (c *Company) Create(name string) {
	c.Id = fmt.Sprintf("%x", uuid.NewV5(uuid.NamespaceDNS, name))
	c.Name = name
	c.events = append(c.events, &CompanyCreated{
		EventRoot{
			CompanyCreatedEvent,
			1.0,
			time.Now().UnixNano(),
			c.Id},
		c.Name})
}

func (c *Company) ChangeName(name string) {
	c.Name = name
	c.events = append(c.events, &CompanyNameChanged{
		EventRoot{
			CompanyNameChangedEvent,
			1.0,
			time.Now().UnixNano(),
			c.Id},
		c.Name})
}

func (c *Company) created(created CompanyCreated) {
	c.Id = created.Root().AggregateId
	c.Name = created.CompanyName
}

func (c *Company) nameChanged(changed CompanyNameChanged) {
	c.Name = changed.CompanyName
}
