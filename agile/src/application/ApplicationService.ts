import EventBus from "../domain/EventBus";
import EventPublisher from "../domain/EventPublisher";
import DomainEvent from "../domain/DomainEvent";

export default abstract class ApplicationService implements EventPublisher{

    protected constructor(private readonly eventBus: EventBus) {}

    async publish(event: DomainEvent){
        if (event){
            this.eventBus.publish(event);
        }
    }
}
