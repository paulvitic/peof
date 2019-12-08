import {DataCollectionFinished, DataCollectionStarted} from "../../../src/domain/DataCollectionEvent";
import FileDataCollectionMonitor from "../../../src/infrastructure/persistence/FileDataCollectionMonitor";
import {EventEmitter} from "events";

test('should update state', () => {
    const dataCollectionMonitor = new FileDataCollectionMonitor();
    const emitter= new EventEmitter();
    emitter.addListener(DataCollectionStarted.name, dataCollectionMonitor.on);
    emitter.addListener(DataCollectionFinished.name, dataCollectionMonitor.on);

    emitter.emit(DataCollectionStarted.name, new DataCollectionStarted("DataCollection","1111", new Date(), new Date()));
    expect(dataCollectionMonitor.isRunning()).toBe(true);

    emitter.emit(DataCollectionFinished.name, new DataCollectionFinished("DataCollection","1111", new Date(), new Date(), "Success"));
    expect(dataCollectionMonitor.isRunning()).toBe(false);
});
