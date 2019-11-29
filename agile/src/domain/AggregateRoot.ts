import DomainEvent from "./DomainEvent";
import Identity from "./Identity";

export abstract class AggregateRoot {
    private readonly _id: string;
    private readonly _type: string;
    private readonly _domainEvents: DomainEvent[];

    protected constructor() {
        this._id = Identity.generate();
        this._type = this.constructor.name;
        this._domainEvents = new Array<DomainEvent>()
    }

    public get id() {
        return this._id;
    }

    public get type() {
        return this._type;
    }

    public get domainEvents() {
        return this._domainEvents;
    }

    public clearDomainEvents() {
        this.domainEvents.splice(0, this.domainEvents.length);
    }
}
