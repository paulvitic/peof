import {AggregateRoot} from "./AggregateRoot";
import {DataCollectionStarted, DataCollectionFinished} from "./DataCollectionEvent";
import DomainEvent from "./DomainEvent";

export enum DataCollectionError {
    InvalidCreationArguments,
    CollectionAlreadyRunning,
}

export enum DataCollectionStatus {
    Running,
    Success,
    Failed,
}

export default class DataCollection extends AggregateRoot {
    private startDate: Date | undefined;
    private changesSince: Date | undefined;
    private ticketUpdatesCollected: boolean = false;
    private status: DataCollectionStatus = DataCollectionStatus.Running;
    private endDate: Date | undefined;

    static fromEvents(id: string, events: DomainEvent[]): DataCollection {
        const dataCollection = new DataCollection(id);
        for (let event of events){
            switch (event.eventType()) {
                case DataCollectionStarted.name:
                    dataCollection.onDataCollectionStarted(event as DataCollectionStarted);
                    break;
                case DataCollectionFinished.name:
                    dataCollection.onTicketsUpdatesCollected();
                    break;
                default:
            }
        }
        return dataCollection;
    }

    static start = async (changesSince: Date): Promise<DataCollection> => {
        const dataCollection = new DataCollection();
        dataCollection.recordEvent(new DataCollectionStarted(
            dataCollection.type,
            dataCollection.id,
            new Date(),
            changesSince));
        return dataCollection;
    };

    completeTicketUpdatesCollection() {
        this.onTicketsUpdatesCollected();
        if(this.isComplete()) {
            this.recordEvent(new DataCollectionFinished(
                this.type,
                this.id,
                this.startDate,
                this.endDate,
                DataCollectionStatus[this.status]));
        }
    }

    private isComplete(): boolean {
        if (this.ticketUpdatesCollected) {
            this.endDate = new Date();
            this.status = DataCollectionStatus.Success;
            return true;
        }
        return false;
    }

    private onDataCollectionStarted(event : {startDate: Date, changesSince: Date}) {
        this.startDate = event.startDate;
        this.changesSince = event.changesSince
    }

    private onTicketsUpdatesCollected() {
        this.ticketUpdatesCollected = true;
    }
}
