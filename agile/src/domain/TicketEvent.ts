import {AbstractDomainEvent} from "./DomainEvent";

/**
 *
 */
export class TicketCreated extends AbstractDomainEvent {
    constructor(aggregate: string,
                aggregateId: string,
                readonly createdOn: Date) {
        super(aggregate, aggregateId);
    }
}
