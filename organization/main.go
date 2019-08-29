package main

import (
	"os"

	"github.com/paulvitic/peof/organization/config"
	"github.com/paulvitic/peof/organization/domain"
	"github.com/paulvitic/peof/organization/port/eventStore"
	"github.com/paulvitic/peof/organization/port/message"
	"github.com/paulvitic/peof/organization/port/rest"
	"github.com/paulvitic/peof/organization/service"
)

func main() {
	profile := os.Getenv("PROFILE")
	if cnf, errs := config.NewConfig(profile); errs != nil {
		panic(errs)

	} else {
		// wire up the application
		orgUnitHandler := rest.NewCompanyHandler(
			service.NewCompanyService(
				buildDispatcher(cnf),
				buildEventStore(cnf)))

		server := rest.NewServer(orgUnitHandler, cnf)
		server.Run()
	}
}

func buildDispatcher(config *config.Configuration) domain.EventPublisher {
	/*url := config.RabbitMQ.Url
	if strings.Compare(url, "fake://foo") == 0 {
		fmt.Printf("Building fake dispatcher for queue.")
		return message.NewFakeMessageDispatcher()
	}*/
	return message.NewAmqpEventPublisher(config.RabbitMQ.Url)
}

func buildEventStore(config *config.Configuration) domain.EventStore {
	return eventStore.NewMongoEventStore(config)
}
