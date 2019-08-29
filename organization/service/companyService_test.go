package service

import (
	"log"
	"reflect"
	"testing"

	"github.com/paulvitic/peof/organization/domain"
)

type FakeMessageDispatcher struct {
	Messages []domain.Event
}

// NewFakeMessageDispatcher creates a fake dispatcher
func NewFakeMessageDispatcher() *FakeMessageDispatcher {
	return &FakeMessageDispatcher{make([]domain.Event, 0)}
}

// DispatchMessage implementation of dispatch message interface method
func (q *FakeMessageDispatcher) Dispatch(events []domain.Event) (err error) {
	for _, event := range events {
		log.Printf("%#v", event)
		q.Messages = append(q.Messages, event.(domain.Event))
	}
	return
}

var service = &CompanyService{
	eventHandler: &applicationService{
		eventPublisher: NewFakeMessageDispatcher(),
		eventStore:     nil,
	},
}

func TestCompanyService_CreateCompany(t *testing.T) {
	type args struct {
		name string
	}
	tests := []struct {
		name           string
		args           args
		wantNewCompany *domain.Company
		wantErr        bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			gotNewCompany, err := service.CreateCompany(tt.args.name)
			if (err != nil) != tt.wantErr {
				t.Errorf("CompanyService.CreateCompany() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(gotNewCompany, tt.wantNewCompany) {
				t.Errorf("CompanyService.CreateCompany() = %v, want %v", gotNewCompany, tt.wantNewCompany)
			}
		})
	}
}

func TestCompanyService_ChangeCompanyName(t *testing.T) {
	type args struct {
		id      string
		newName string
	}
	tests := []struct {
		name               string
		args               args
		wantUpdatedCompany *domain.Company
		wantErr            bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {

			gotUpdatedCompany, err := service.ChangeCompanyName(tt.args.id, tt.args.newName)
			if (err != nil) != tt.wantErr {
				t.Errorf("CompanyService.ChangeCompanyName() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(gotUpdatedCompany, tt.wantUpdatedCompany) {
				t.Errorf("CompanyService.ChangeCompanyName() = %v, want %v", gotUpdatedCompany, tt.wantUpdatedCompany)
			}
		})
	}
}
