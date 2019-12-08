import {DataCollectionError} from "./DataCollection";
import {Except, withFailure, Failure, withSuccess} from "./Except";
import {DataCollectionMonitor} from "./DataCollectionMonitor";
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
    constructor(private readonly monitor: DataCollectionMonitor,
                private readonly tracker: DataCollectionTracker) {
    }

    start(forChangesSince: Date): Except<Failure<DataCollectionError.CollectionAlreadyRunning>, void>{
        if(this.monitor.isRunning()) return withFailure(collectionAlreadyRunning());
        return withSuccess(this.tracker.startDataCollection(forChangesSince));
    }
}
