package message

import "organization.peof/domain"

type AmqpPublisher interface {
	Dispatch(events []domain.Event) (err error)
}
