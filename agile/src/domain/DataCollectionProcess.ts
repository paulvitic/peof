import EventListener from "./EventListener";
import DomainEvent from "./DomainEvent";
import EventPublisher from "./EventPublisher";
import EventBus from "./EventBus";
import { DataCollectionStarted, UpdatedTicketsCollected } from "./DataCollectionEvent";
import DataCollectionClient from "./DataCollectionClient";
import {Repository} from "./Repository";
import DataCollection from "./DataCollection";
import {AggregateRoot} from "./AggregateRoot";

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


export class DataCollectionTracker extends DataCollectionProcess {

    constructor(eventBus: EventBus,
                private readonly repository: Repository<DataCollection>) {
        super(eventBus);
    }

    public start(): void {
        DataCollection.create()
            .onSuccess((dataCollection) => this.repository.save(dataCollection)
                .then((saved) => this.publishEventsOf(saved)
                    .then(() => global.log.info("Data collection started"))));
    }

    public on(event: DomainEvent): void {
        global.log.info("Data collection finished");
    }
}


export class UpdatedTicketsCollector extends DataCollectionProcess {

    constructor(private readonly dataCollectionClient: DataCollectionClient,
                eventBus: EventBus) {
        super(eventBus);
    }

    public on = (event: DataCollectionStarted): void => {
        switch(event.eventType()) {
            case "DataCollectionStarted": {
                this.collectUpdatedTickets(event.aggregateId());
                break;
            }
            default: {
                global.log.warn("Dont know event type " + event.eventType());
                break;
            }
        }
    };

    private collectUpdatedTickets = (aggregateId: string) =>  {
        this.dataCollectionClient.ticketsCreatedSince(new Date());
        const newEvent = new UpdatedTicketsCollected("DataCollection", aggregateId);
        this.publish(newEvent).then(() => global.log.info("Newly created ticket data collected"));
    }
}
