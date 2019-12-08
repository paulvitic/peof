import DomainEvent, {AbstractDomainEvent} from "./DomainEvent";

class EventMutatorPattern<T>{
    private readonly eventType: string;

    constructor(event: any,
                private readonly mutator:(event: T) => void) {
        this.eventType = event.name;
        this.mutator = mutator;
    }

    matches = (eventType: any): boolean => {
        return this.eventType === eventType.constructor.name;
    };

    apply = (event: T): void => {
        return this.mutator(event);
    }
}

class MutateSelector<T> {
    private readonly patterns = new Array<EventMutatorPattern<T>>();

    when = (event:any, mutator: (event:T) => void) => {
        this.patterns.push(new EventMutatorPattern<T>(event, mutator));
        return this;
    };

    mutate = (event: T): void => {
        this.patterns
            .filter((pattern) => pattern.matches(event))
            .some((pattern) => pattern.apply(event));
    }
}

export abstract class View<T extends DomainEvent = DomainEvent> {
    abstract on(event: T): void;

    select = (): MutateSelector<T> => {
        return new MutateSelector<T>();
    }
}
