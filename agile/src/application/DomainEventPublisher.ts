import DomainEvent from "../domain/DomainEvent";

export default interface DomainEventPublisher {
    publish(event: DomainEvent): void
}