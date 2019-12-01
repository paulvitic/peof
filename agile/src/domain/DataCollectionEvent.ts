import {AbstractDomainEvent} from "./DomainEvent";
import {JiraIssue} from "./Ticket";

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
                readonly updates: JiraIssue[]) {
        super(aggregate, aggregateId);
    }
}
