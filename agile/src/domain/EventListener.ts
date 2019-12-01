import DomainEvent from "./DomainEvent";

/**
 *
 */
export default interface EventListener {
    on(event: DomainEvent): DomainEvent | void;
}
