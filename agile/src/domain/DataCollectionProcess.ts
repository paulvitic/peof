import EventListener from "./EventListener";
import DomainEvent from "./DomainEvent";
import EventPublisher from "./EventPublisher";
import EventBus from "./EventBus";
import {DataCollectionStarted, TicketUpdatesCollected} from "./DataCollectionEvent";
import DataCollectionClient from "./DataCollectionClient";
import DataCollection from "./DataCollection";
import {AggregateRoot} from "./AggregateRoot";
import {Ticket} from "./Ticket";
import EventStore from "./EventStore";

export type TicketUpdatesPublisher = (updates: Ticket[]) => void;

/**
 *
 */
abstract class DataCollectionProcess implements EventPublisher, EventListener {
    protected constructor(private readonly eventBus: EventBus) {}

    publishEventsOf = async (aggregate: AggregateRoot): Promise<void> => {
        aggregate.publishEventsUsing(this.eventBus.publish);
    };

    publish = async (event: DomainEvent) => {
        if(this.eventBus) {
            this.eventBus.publish(event);
        }
    };

    abstract on(event: DomainEvent): DomainEvent | void;
}

/**
 *
 */
export class DataCollectionTracker extends DataCollectionProcess {

    constructor(private readonly eventStore: EventStore,
                eventBus: EventBus) {
        super(eventBus);
    }

    public startDataCollection = (forChangesSince: Date): void => {
        DataCollection.start(forChangesSince)
                .then((dataCollection) => this.publishEventsOf(dataCollection)
                    .then(() => global.log.info("Data collection started")));
    };

    public on = (event: DomainEvent): void => {
        switch(event.eventType()) {
            case TicketUpdatesCollected.name: {
                const events = this.eventStore.eventsOfAggregate(event.aggregate(), event.aggregateId());
                const dataCollection = DataCollection.fromEvents(event.aggregateId(), events);
                dataCollection.completeTicketUpdatesCollection();
                this.publishEventsOf(dataCollection);
                break;
            }
            default: {
                global.log.warn("Dont know event type " + event.eventType());
                break;
            }
        }
    }
}

/**
 *
 */
export class UpdatedTicketsCollector extends DataCollectionProcess {
    constructor(private readonly dataCollectionClient: DataCollectionClient,
                eventBus: EventBus) {
        super(eventBus);
    }

    public on = (event: DataCollectionStarted): void => {
        this.dataCollectionClient.fetchUpdatedTicketsSince(
            new Date(),
            this.ticketUpdatesPublisher(event.aggregateId()));
    };

    private ticketUpdatesPublisher = (aggregateId: string): TicketUpdatesPublisher => {
        return (updates : Ticket[]) => {
            this.publish(new TicketUpdatesCollected(
                DataCollection.name,
                aggregateId,
                updates)
            ).then(()=> global.log.info(`${updates.length} ticket updates published`))
        }
    };
}
