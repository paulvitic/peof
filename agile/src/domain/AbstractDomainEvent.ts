import DomainEvent from "./DomainEvent";

export default abstract class AbstractDomainEvent implements DomainEvent {

    private readonly _generatedOn: Date;
    private readonly _eventType: string;

    constructor(private readonly _aggregate: string,
                private readonly _aggregateId: string) {
        this._eventType = this.constructor.name;
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

    eventType(): string {
        return this._eventType;
    }
}
