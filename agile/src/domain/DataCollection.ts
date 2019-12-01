import {AggregateRoot} from "./AggregateRoot";
import {DataCollectionStarted} from "./DataCollectionEvent";

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
    private readonly startDate: Date;
    private updatedTicketsCollected: boolean = false;

    constructor(private readonly changesSince: Date) {
        super();
        this.startDate = new Date();
        this.generateEvent(
            new DataCollectionStarted(
                this.type,
                this.id,
                this.startDate,
                this.changesSince
            )
        );
    }

    static start = async (changesSince: Date): Promise<DataCollection> => {
        return new DataCollection(changesSince);
    }
}
