import EventBus from "../../domain/EventBus";
import DomainEvent from "../../domain/DomainEvent";
import EventListener from "../../domain/EventListener";
import {EventEmitter} from "events";
import EventStore from "../../domain/EventStore";

/**
 *
 */
export default class LocalEventBus implements EventBus {
    private emitter= new EventEmitter();

    constructor(private eventStore: EventStore) {}

    publish = async (event: DomainEvent): Promise<void> => {
        global.log.info(`Emitting event type ${event.eventType()}`);
        this.eventStore.logEvent(event);
        this.emitter.emit(event.eventType(), event);
    };

    subscribe = (eventType: string, listener: EventListener): void => {
        global.log.info(`Subscribing to event type ${eventType}`);
        this.emitter.on(eventType, listener.on);
    }
}
