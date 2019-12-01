import {AbstractDomainEvent} from "./DomainEvent";
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
