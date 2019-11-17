export interface DomainEvent{
    type(): string;
    aggregate(): string;
    aggregateId(): string;
    generatedOn(): Date;
}