package rest

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"github.com/unrolled/render"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"organization.peof/service"
)

type CompanyHandler struct {
	companyService *service.CompanyService
}

func NewCompanyHandler(companyService *service.CompanyService) *CompanyHandler {
	return &CompanyHandler{companyService: companyService}
}

func (handler *CompanyHandler) handle(formatter *render.Render) http.HandlerFunc {

	return func(writer http.ResponseWriter, req *http.Request) {
		switch req.Method {

		case "POST":
			body, err := ioutil.ReadAll(req.Body)
			defer closeWhenDone(req.Body)()
			if err != nil {
				respondWithError(err, formatter, writer)
				return
			}

			var msg CreateOrganizationReq
			if err = json.Unmarshal(body, &msg); err != nil {
				respondWithError(err, formatter, writer)
				return
			}

			if err, company := handler.companyService.CreateCompany(msg.Name); err != nil {
				respondWithError(err, formatter, writer)
				return
			} else {
				writer.Header().Set("Server", "Organization command server")
				res := OrganizationRes{}
				_ = formatter.JSON(writer, http.StatusOK, res.mapFrom(company))
				return
			}

		case "PUT":
			body, err := ioutil.ReadAll(req.Body)
			defer closeWhenDone(req.Body)()
			if err != nil {
				respondWithError(err, formatter, writer)
				return
			}

			var msg CreateOrganizationReq
			if err = json.Unmarshal(body, &msg); err != nil {
				respondWithError(err, formatter, writer)
				return
			}

			companyId := mux.Vars(req)["companyId"]

			if err, company := handler.companyService.ChangeCompanyName(companyId, msg.Name); err != nil {
				respondWithError(err, formatter, writer)
				return
			} else {
				writer.Header().Set("Server", "Organization command server")
				res := OrganizationRes{}
				_ = formatter.JSON(writer, http.StatusOK, res.mapFrom(company))
				return
			}

		case "DELETE":

		default:
			msg := fmt.Sprintf("no route for request methos %s", req.Method)
			log.Println(msg)
			_ = formatter.JSON(writer, http.StatusNoContent, ErrResponse{Error: msg})
		}
	}
}

func respondWithError(err error, formatter *render.Render, writer http.ResponseWriter) {
	log.Printf("[error] while reading create company request body: %s", err.Error())
	_ = formatter.JSON(writer, http.StatusBadRequest, ErrResponse{Error: err.Error()})
}

func closeWhenDone(target io.Closer) func() {
	return func() {
		err := target.Close()
		if err != nil {
			log.Printf("error while closing io %s", err.Error())
		}
	}
}
