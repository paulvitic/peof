import DomainEvent from "./DomainEvent";
import EventListener from "./EventListener";

export default interface EventBus {
    publish(event: DomainEvent): void
    subscribe(eventType: string, listener: EventListener): void
}
