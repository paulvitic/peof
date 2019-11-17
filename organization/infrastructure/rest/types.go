package rest

import (
	"github.com/paulvitic/peof/organization/domain"
)

const (
	changeNameAction = "changeName"
)

type CreateOrganizationReq struct {
	Name string `json:"name"`
}

type UpdateOrganizationReq struct {
	Action string `json:"action"`
	Name   string `json:"name"`
}

type ErrResponse struct {
	Error string `json:"error,omitempty"`
}

type OrganizationRes struct {
	ErrResponse
	Id                  string `json:"id"`
	Name                string `json:"name"`
	JiraProjectKey      string `json:"jiraProjectKey,omitempty"`
	BitbucketProjectKey string `json:"bitbucketProjectKey,omitempty"`
}

func (o *OrganizationRes) mapFrom(company *domain.Company) *OrganizationRes {
	o.Id = company.Id
	o.Name = company.Name
	return o
}

func (o *OrganizationRes) mapAllFrom(orgUnits []domain.Company) *[]OrganizationRes {
	responses := make([]OrganizationRes, len(orgUnits))
	for i, v := range orgUnits {
		response := OrganizationRes{}
		response.mapFrom(&v)
		responses[i] = response
	}
	return &responses
}
