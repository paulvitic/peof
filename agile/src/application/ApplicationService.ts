import DomainEventPublisher from "./DomainEventPublisher";
import DomainEvent from "../domain/DomainEvent";

export default abstract class ApplicationService {

    constructor(private readonly eventPublisher: DomainEventPublisher) {}

    protected publish(event: DomainEvent | undefined){
        if (event){
            this.eventPublisher.publish(event);
        }
    }
}