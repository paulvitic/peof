import {Except, Failure, withSuccess} from "./Except";
import {AggregateRoot} from "./AggregateRoot";
import {DataCollectionStarted} from "./DataCollectionEvent";

export enum DataCollectionError {
    InvalidCreationArguments,
    CollectionAlreadyRunning,
}

interface DataCollectionProperties {
    email: string;
    firstName: string;
    lastName: string;
}

export default class DataCollection extends AggregateRoot {

    private readonly startDate: Date;

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

    static create = async (changesSince: Date): Promise<DataCollection> => {
        return new DataCollection(changesSince);
    }
}
