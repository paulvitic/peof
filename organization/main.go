package main

import (
	"github.com/paulvitic/peof/organization/infrastructure"
	"os"

	"github.com/paulvitic/peof/organization/domain"
	"github.com/paulvitic/peof/organization/infrastructure/eventStore"
	"github.com/paulvitic/peof/organization/infrastructure/message"
	"github.com/paulvitic/peof/organization/infrastructure/rest"
	"github.com/paulvitic/peof/organization/service"
)

func main() {
	profile := os.Getenv("PROFILE")
	if cnf, errs := infrastructure.NewConfig(profile); errs != nil {
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

func buildDispatcher(config *infrastructure.Configuration) domain.EventPublisher {
	/*url := config.RabbitMQ.Url
	if strings.Compare(url, "fake://foo") == 0 {
		fmt.Printf("Building fake dispatcher for queue.")
		return message.NewFakeMessageDispatcher()
	}*/
	return message.NewAmqpEventPublisher(config.RabbitMQ.Url)
}

func buildEventStore(config *infrastructure.Configuration) domain.EventStore {
	return eventStore.NewMongoEventStore(config)
}
