import DomainEventPublisher from "../../application/DomainEventPublisher";
import DomainEvent from "../../domain/DomainEvent";

export default class LocalEventPublisher implements DomainEventPublisher {
    publish(event: DomainEvent): void {
        global.log.info(event.eventType() + ' published');
    }
}