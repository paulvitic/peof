package service

import (
	"errors"
	"organization.peof/domain"
)

type CompanyService struct {
	eventHandler *applicationService
}

func NewCompanyService(eventPublisher domain.EventPublisher, eventStore domain.EventStore) *CompanyService {
	return &CompanyService{
		eventHandler: &applicationService{
			eventPublisher: eventPublisher,
			eventStore:     eventStore,
		},
	}
}

func (c *CompanyService) CreateCompany(name string) (err error, newCompany *domain.Company) {
	newCompany = &domain.Company{}
	newCompany.Create(name)

	if err, exists := c.eventHandler.noPreviousEventsFor(newCompany.Id, company); err != nil {
		return err, nil
	} else {
		if exists {
			err = errors.New("company already exists")
			return err, nil
		}
		if err := c.eventHandler.registerEventsFor(newCompany, company); err != nil {
			return err, nil
		}
	}

	return
}

func (c *CompanyService) ChangeCompanyName(id string, newName string) (err error, updatedCompany *domain.Company) {

	err, events := c.eventHandler.eventsOf(id, company)
	if err != nil {
		return err, nil
	}

	restoredCompany := domain.Company{}
	restoredCompany.From(events)

	if restoredCompany.Id != id {
		err = errors.New("no company exists with id " + id)
		return err, nil
	}

	restoredCompany.ChangeName(newName)
	if err := c.eventHandler.registerEventsFor(&restoredCompany, company); err != nil {
		return err, nil
	}

	updatedCompany = &restoredCompany
	return
}
