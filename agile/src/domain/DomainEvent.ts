/**
 *
 */
export enum EventType {
    DataCollectionStarted,
    UpdatedTicketsFound
}

/**
 *
 */
export default interface DomainEvent {
    eventType(): EventType;
    aggregate(): string;
    aggregateId(): string;
    generatedOn(): Date;
}

/**
 *
 */
export abstract class AbstractDomainEvent implements DomainEvent {
    private readonly _generatedOn: Date;
    private readonly _eventType: EventType;

    constructor(private readonly _aggregate: string,
                private readonly _aggregateId: string) {
        this._eventType = (<any>EventType)[this.constructor.name];
        this._generatedOn= new Date();
    }

    aggregate(): string {
        return this._aggregate;
    }

    aggregateId(): string {
        return this._aggregateId;
    }

    generatedOn(): Date {
        return this._generatedOn;
    }

    eventType(): EventType {
        return this._eventType;
    }
}
