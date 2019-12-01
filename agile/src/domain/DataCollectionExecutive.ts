import DataCollection, {DataCollectionError} from "./DataCollection";
import {Except, withFailure, Failure, withSuccess} from "./Except";
import {Repository} from "./Repository";
import {DataCollectionView} from "./DataCollectionView";
import {DataCollectionTracker} from "./DataCollectionProcess";

/**
 *
 */
const collectionAlreadyRunning = (): Failure<number> => ({
    type: DataCollectionError.CollectionAlreadyRunning,
    reason: 'A data collection is already running.',
});

/**
 *
 */
export default class DataCollectionExecutive {
    constructor(private readonly repository: Repository<DataCollection>,
                private readonly view: DataCollectionView,
                private readonly tracker: DataCollectionTracker) {
    }

    start(forChangesSince: Date): Except<Failure<DataCollectionError.CollectionAlreadyRunning>, void>{
        if(this.view.thereIsRunningCollection()) return withFailure(collectionAlreadyRunning());
        return withSuccess(this.tracker.startDataCollection(forChangesSince));
    }
}
