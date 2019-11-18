import DomainEvent from "./DomainEvent";

export default interface DataCollectionProcessor<T extends DomainEvent> {
    process(event: T): DomainEvent | undefined;
}