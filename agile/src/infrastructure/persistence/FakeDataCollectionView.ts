import {DataCollectionStatus} from "../../domain/DataCollectionStatus";

/**
 *
 */
export default class FakeDataCollectionView implements DataCollectionStatus {
    thereIsRunningCollection(): boolean {
        return false;
    }
}
