import EventBus from "../../domain/EventBus";
import DomainEvent from "../../domain/DomainEvent";
import {EventEmitter} from "events";
import EventStore from "../../domain/EventStore";

export default class LocalEventBus implements EventBus {
    private emitter= new EventEmitter();

    constructor(private eventStore: EventStore) {}

    publish = async <T extends DomainEvent = DomainEvent>(event: T): Promise<void> => {
        global.log.info(`Emitting event type ${event.eventType()}`);
        this.eventStore.logEvent(event);
        this.emitter.emit(event.eventType(), event);
    };

    subscribe = <T extends DomainEvent = DomainEvent>(eventType: string, handler: (event: T) => void): void => {
        this.emitter.on(eventType, handler);
    }
}
