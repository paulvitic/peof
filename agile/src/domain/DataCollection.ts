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
    private startDate: Date;

    constructor() {
        super();
        this.startDate = new Date();
        this.generateEvent(new DataCollectionStarted(this.type, this.id))
    }

    static create(): Except<Failure<DataCollectionError.InvalidCreationArguments>, DataCollection> {
        return withSuccess(new DataCollection());
    }
}
