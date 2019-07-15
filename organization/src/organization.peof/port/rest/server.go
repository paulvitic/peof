package rest

import (
	"log"
	"net/http"
	"organization.peof/config"
	"os"

	"github.com/gorilla/mux"
	"github.com/unrolled/render"
	"github.com/urfave/negroni"
)

type Server struct {
	configuration  *config.Configuration
	companyHandler *CompanyHandler
}

func NewServer(orgUnitHandler *CompanyHandler, config *config.Configuration) *Server {
	return &Server{
		configuration:  config,
		companyHandler: orgUnitHandler,
	}
}

func (server *Server) Run() {
	router := mux.NewRouter()

	formatter := render.New(render.Options{
		IndentJSON: true,
	})

	log.Printf("[info] mapping API endpoints to '/api' path prefix")
	api := router.PathPrefix("/api").Subrouter()
	api.Path("/companies").HandlerFunc(server.companyHandler.handle(formatter)).Methods("POST")
	api.Path("/companies/{companyId}").HandlerFunc(server.companyHandler.handle(formatter)).Methods("PUT", "DELETE")

	webRoot := os.Getenv("WEBROOT")
	if len(webRoot) == 0 {
		log.Printf("[warn] environment variable 'WEBROOT' not found, using working directory")
		root, err := os.Getwd()
		if err != nil {
			panic("could not retrieve working directory")
		} else {
			webRoot = root + "/app/build/"
		}
	}

	log.Printf("[info] serving static files from %v", webRoot)
	router.PathPrefix("/").Handler(http.FileServer(http.Dir(webRoot)))

	n := negroni.Classic()
	n.UseHandler(router)

	n.Run(":" + server.configuration.Port)
}
