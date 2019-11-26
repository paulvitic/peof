import DomainEvent from "./DomainEvent";

export default interface EventPublisher {
    publish(event: DomainEvent ): void
}
