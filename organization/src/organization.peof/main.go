package main

import (
	"organization.peof/config"
	"organization.peof/domain"
	"organization.peof/port/eventStore"
	"organization.peof/port/message"
	"organization.peof/port/rest"
	"organization.peof/service"
	"os"
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
