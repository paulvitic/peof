import {AbstractDomainEvent} from "./DomainEvent";

export class DataCollectionStarted extends AbstractDomainEvent {
    constructor(aggregate: string,
                aggregateId: string,
                readonly startDate: Date,
                readonly changesSince: Date) {
        super(aggregate, aggregateId);
    }
}

export class UpdatedTicketsCollected extends AbstractDomainEvent {

}
