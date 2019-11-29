import DataCollection, {DataCollectionError, collectionAlreadyRunning} from "./DataCollection";
import {Except, withFailure, Failure, withSuccess} from "./Except";
import {Repository} from "./Repository";
import {DataCollectionView} from "./DataCollectionView";
import {DataCollectionTracker} from "./DataCollectionProcess";

export default class DataCollectionExecutive {

    constructor(private readonly repository: Repository<DataCollection>,
                private readonly view: DataCollectionView,
                private readonly tracker: DataCollectionTracker) {
    }

    start(): Except<Failure<DataCollectionError.CollectionAlreadyRunning>, void>{
        if(this.view.thereIsRunningCollection()) return withFailure(collectionAlreadyRunning());
        return withSuccess(this.tracker.start());
    }
}
