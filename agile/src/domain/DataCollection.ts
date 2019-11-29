import {Except, Failure, withSuccess} from "./Except";
import {AggregateRoot} from "./AggregateRoot";

export enum DataCollectionError {
    InvalidCreationArguments,
    CollectionAlreadyRunning,
}

export const collectionAlreadyRunning = (): Failure<number> => ({
    type: DataCollectionError.CollectionAlreadyRunning,
    reason: 'Email, Firstname and Lastname cannot be empty',
});


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
    }

    static create(): Except<Failure<DataCollectionError.InvalidCreationArguments>, DataCollection> {
        return withSuccess(new DataCollection());
    }
}
