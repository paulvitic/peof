import EventBus from "../../domain/EventBus";
import DomainEvent from "../../domain/DomainEvent";
import EventListener from "../../domain/EventListener";
import {EventEmitter} from "events";

/**
 *
 */
export default class LocalEventBus implements EventBus {
    private emitter= new EventEmitter();

    publish = async (event: DomainEvent): Promise<void> => {
        global.log.info(`Emitting event type ${event.eventType()}`);
        this.emitter.emit(event.eventType(), event);
    };

    subscribe = (eventType: string, listener: EventListener): void => {
        global.log.info(`Subscribing to event type ${eventType}`);
        this.emitter.on(eventType, listener.on);
    }
}
