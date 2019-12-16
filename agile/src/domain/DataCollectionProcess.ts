import DomainEvent from "./DomainEvent";
import EventPublisher from "./EventPublisher";
import EventBus from "./EventBus";
import {DataCollectionStarted, TicketUpdatesCollected} from "./DataCollectionEvent";
import DataCollectionClient from "./DataCollectionClient";
import DataCollection from "./DataCollection";
import {AggregateRoot} from "./AggregateRoot";
import {TicketProperties} from "./Ticket";
import EventStore from "./EventStore";

export type TicketUpdatesPublisher = (updates: TicketProperties[]) => void;

/**
 *
 */
abstract class DataCollectionProcess implements EventPublisher {
    protected constructor(private readonly eventBus: EventBus) {}

    publishEventsOf = async (aggregate: AggregateRoot): Promise<void> => {
        aggregate.publishEventsUsing(this.eventBus.publish);
    };

    publish = async (event: DomainEvent) => {
        if(this.eventBus) {
            this.eventBus.publish(event);
        }
    };
}


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

    public whenTicketUpdatesAreCollected = (event: TicketUpdatesCollected): void => {
        let dataCollection: DataCollection;
        this.eventStore.eventsOfAggregate(event.aggregate(), event.aggregateId())
            .then((events)=>{
                dataCollection = DataCollection.fromEvents(event.aggregateId(), events);
                dataCollection.completeTicketUpdatesCollection();
                this.publishEventsOf(dataCollection);
            })
    }
}


export class UpdatedTicketsCollector extends DataCollectionProcess {
    constructor(private readonly dataCollectionClient: DataCollectionClient,
                eventBus: EventBus) {
        super(eventBus);
    }

    public whenDataCollectionStarts = (event: DataCollectionStarted): void => {
        this.dataCollectionClient.fetchUpdatedTicketsSince(
            new Date(event.changesSince),
            this.ticketUpdatesPublisher(event.aggregateId()));
    };

    private ticketUpdatesPublisher = (aggregateId: string): TicketUpdatesPublisher => {
        return (updates : TicketProperties[]) => {
            this.publish(new TicketUpdatesCollected(
                DataCollection.name,
                aggregateId,
                updates)
            ).then(() => global.log.info(`${updates.length} ticket updates published`))
        }
    };
}
