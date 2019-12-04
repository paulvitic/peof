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
export class TicketUpdatesCollected extends AbstractDomainEvent {
    constructor(aggregate: string,
                aggregateId: string,
                readonly updates: Ticket[]) {
        super(aggregate, aggregateId);
    }
}

EventRegistry.addEventType(TicketUpdatesCollected.name, TicketUpdatesCollected);


export class DataCollectionFinished extends AbstractDomainEvent {
    constructor(aggregate: string,
                aggregateId: string,
                readonly status: boolean) {
        super(aggregate, aggregateId);
    }
}

EventRegistry.addEventType(DataCollectionFinished.name, DataCollectionFinished);



