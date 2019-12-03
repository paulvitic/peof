import {AbstractDomainEvent, EventRegistry} from "./DomainEvent";
import {Ticket} from "./Ticket";

/**
 *
 */
export class DataCollectionStarted extends AbstractDomainEvent {
    constructor(aggregate: string,
                aggregateId: string,
                readonly startDate: Date,
                readonly changesSince: Date) {
        super(aggregate, aggregateId);
    }
}

EventRegistry.addEventType(DataCollectionStarted.name, DataCollectionStarted);

/**
 *
 */
export class UpdatedTicketsFound extends AbstractDomainEvent {
    constructor(aggregate: string,
                aggregateId: string,
                readonly updates: Ticket[]) {
        super(aggregate, aggregateId);
    }
}

EventRegistry.addEventType(UpdatedTicketsFound.name, UpdatedTicketsFound);



