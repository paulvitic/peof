import {AggregateRoot} from "./AggregateRoot";
import {DataCollectionStarted, UpdatedTicketsFound} from "./DataCollectionEvent";
import DomainEvent from "./DomainEvent";
import {Ticket} from "./Ticket";

/**
 *
 */
export enum DataCollectionError {
    InvalidCreationArguments,
    CollectionAlreadyRunning,
}

/**
 *
 */
export default class DataCollection extends AggregateRoot {
    private startDate: Date | undefined;
    private changesSince: Date | undefined;
    private updatedTicketsCollected: boolean = false;

    private constructor(id?: string) {
        super(id);
    }

    static fromEvents(id: string, events: DomainEvent[]): DataCollection {
        const dataCollection = new DataCollection(id);
        for (let event of events){
            switch (event.eventType()) {
                case DataCollectionStarted.name:
                    dataCollection.onDataCollectionStarted(event as DataCollectionStarted);
                    break;
                case UpdatedTicketsFound.name:
                    dataCollection.onUpdatedTicketsFound(event as UpdatedTicketsFound);
                    break;
                default:
            }
        }
        return dataCollection;
    }

    private onDataCollectionStarted(event : {startDate: Date, changesSince: Date}) {
        this.startDate = event.startDate;
        this.changesSince = event.changesSince
    }

    private onUpdatedTicketsFound(event : {updates: Ticket[]}) {
        this.updatedTicketsCollected = true;
    }

    static start = async (changesSince: Date): Promise<DataCollection> => {
        const dataCollection = new DataCollection();
        dataCollection.recordEvent(new DataCollectionStarted(
            dataCollection.id,
            dataCollection.type,
            new Date(),
            changesSince));
        return dataCollection;
    };
}
