import EventBus from "../../domain/EventBus";
import DomainEvent from "../../domain/DomainEvent";
import EventListener from "../../domain/EventListener";
import {EventEmitter} from "events";

export default class LocalEventBus implements EventBus {

    private emitter= new EventEmitter();

    publish = async (event: DomainEvent): Promise<void> => {
        this.emitter.emit(event.eventType(), event);
    };

    subscribe = (eventType: string, listener: EventListener): void => {
        this.emitter.on(eventType, listener.on);
    }
}
