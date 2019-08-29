package message

import "github.com/paulvitic/peof/organization/domain"

type AmqpPublisher interface {
	Dispatch(events []domain.Event) (err error)
}
