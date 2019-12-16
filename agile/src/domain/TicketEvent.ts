import {AbstractDomainEvent} from "./DomainEvent";
import {TicketProperties} from "./Ticket";

export class TicketCreated extends AbstractDomainEvent {
    constructor(aggregate: string,
                aggregateId: string,
                readonly ticketProps: TicketProperties) {
        super(aggregate, aggregateId);
    }
}
