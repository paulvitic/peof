import EventListener from "./EventListener";
import DomainEvent from "./DomainEvent";
import EventPublisher from "./EventPublisher";
import EventBus from "./EventBus";

export abstract class DataCollectionProcessor implements EventPublisher, EventListener {

    constructor(private readonly eventBus: EventBus) {}

    publish = async (event: DomainEvent): Promise<void> => {
        if (this.eventBus) {
            this.eventBus.publish(event);
        }
    };

    abstract on(event: DomainEvent): DomainEvent | void;
}
