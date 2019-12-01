import {DataCollectionView} from "../../domain/DataCollectionView";

/**
 *
 */
export default class FakeDataCollectionView implements DataCollectionView{
    thereIsRunningCollection(): boolean {
        return false;
    }
}
