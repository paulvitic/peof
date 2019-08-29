package rest

import (
	"net/http"
	"reflect"
	"testing"

	"github.com/paulvitic/peof/organization/service"
	"github.com/unrolled/render"
)

func TestStatus(t *testing.T) {

}

func TestCompanyHandler_handle(t *testing.T) {
	type fields struct {
		companyService *service.CompanyService
	}
	type args struct {
		formatter *render.Render
	}
	tests := []struct {
		name   string
		fields fields
		args   args
		want   http.HandlerFunc
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			handler := &CompanyHandler{
				companyService: tt.fields.companyService,
			}
			if got := handler.handle(tt.args.formatter); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("CompanyHandler.handle() = %v, want %v", got, tt.want)
			}
		})
	}
}
