import EventListener from "./EventListener";
import DomainEvent, {EventType} from "./DomainEvent";
import EventPublisher from "./EventPublisher";
import EventBus from "./EventBus";
import {DataCollectionStarted, UpdatedTicketsFound} from "./DataCollectionEvent";
import DataCollectionClient from "./DataCollectionClient";
import {Repository} from "./Repository";
import DataCollection from "./DataCollection";
import {AggregateRoot} from "./AggregateRoot";
import {Ticket} from "./Ticket";

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
    constructor(eventBus: EventBus,
                private readonly repository: Repository<DataCollection>) {
        super(eventBus);
    }

    public startDataCollection(forChangesSince: Date): void {
        DataCollection.start(forChangesSince)
            .then((dataCollection) =>this.repository.save(dataCollection)
                .then((saved) => this.publishEventsOf(saved)
                    .then(() => global.log.info("Data collection started"))));
    }

    public on(event: DomainEvent): void {
        global.log.info("Data collection finished");
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
        switch(event.eventType()) {
            case EventType.DataCollectionStarted: {
                this.collectUpdatedTickets(event.aggregateId());
                break;
            }
            default: {
                global.log.warn("Dont know event type " + event.eventType());
                break;
            }
        }
    };

    private collectUpdatedTickets = (aggregateId: string): void =>  {
        this.dataCollectionClient.ticketsUpdatedSince(new Date(), this.ticketUpdatesPublisher(aggregateId));
    };

    private ticketUpdatesPublisher = (aggregateId: string): TicketUpdatesPublisher => {
        return (updates : Ticket[]) => {
            this.publish(new UpdatedTicketsFound(
                DataCollection.name,
                aggregateId,
                updates)
            ).then(()=> global.log.info(`${updates.length} ticket updates published`))
        }
    };
}
