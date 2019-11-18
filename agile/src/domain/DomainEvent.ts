export default interface DomainEvent {
    eventType(): string;
    aggregate(): string;
    aggregateId(): string;
    generatedOn(): Date;
}