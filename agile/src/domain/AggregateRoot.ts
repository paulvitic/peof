import DomainEvent from "./DomainEvent";
import Identity from "./Identity";

/**
 *
 */
export abstract class AggregateRoot {
    private readonly _id: string;
    private readonly _type: string;
    private readonly _domainEvents: DomainEvent[];

    protected constructor() {
        this._id = Identity.generate();
        this._type = this.constructor.name;
        this._domainEvents = new Array<DomainEvent>()
    }

    //abstract fromEvents(events: DomainEvent[]):AggregateRoot {}

    public get id() {
        return this._id;
    }

    public get type() {
        return this._type;
    }

    public publishEventsUsing(publisher: (event: DomainEvent) => void) {
        let nextEvent = this._domainEvents.pop();
        while (nextEvent) {
            publisher(nextEvent);
            nextEvent = this._domainEvents.pop();
        }
    }

    protected generateEvent(event: DomainEvent): void {
        this._domainEvents.push(event);
    }
}
