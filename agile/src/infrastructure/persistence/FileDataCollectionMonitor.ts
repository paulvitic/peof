import {DataCollectionMonitor, DataCollectionState} from "../../domain/DataCollectionMonitor";
import DomainEvent from "../../domain/DomainEvent";
import {DataCollectionFinished, DataCollectionStarted} from "../../domain/DataCollectionEvent";
import {View} from "../../domain/View";
import fs from "fs";

export default class FileDataCollectionMonitor extends View implements DataCollectionMonitor {

    private readonly filePath = "./data/view/dataCollectionMonitor.json";

    onEvent = (event: DomainEvent): void => {
        this.select()
            .when(DataCollectionStarted, this.startDataCollection)
            .when(DataCollectionFinished, this.endDataCollection)
            .mutate(event);
    };

    isRunning = () => {
        const state: DataCollectionState = this.state();
        return state.running;
    };

    state = (): DataCollectionState => {
        return JSON.parse(fs.readFileSync(this.filePath).toString());
    };

    private endDataCollection = (event: DomainEvent): void => {
        const status: DataCollectionState = this.state();
        status.running = false;

        let duration = this.collectionDuration(event as DataCollectionFinished);
        status.averageDuration = Number(((status.averageDuration + duration) / 2).toFixed(3));

        this.update(status);
    };

    private startDataCollection = (event: DomainEvent): void => {
        const state: DataCollectionState = this.state();
        state.running = true;
        this.update(state);
    };

    private update = (state: DataCollectionState): void => {
        fs.writeFileSync(this.filePath, JSON.stringify(state));
    };

    private collectionDuration = (event: DataCollectionFinished): number => {
        let {startDate, endDate} = event;
        if (endDate && startDate) {
            return (new Date(endDate).getTime() -  new Date(startDate).getTime()) / 1000;
        }
        return 0;
    }
}
