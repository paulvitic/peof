import DomainEvent from "./DomainEvent";
import DataCollectionStarted from "./DataCollectionStarted";
import {DataCollectionProcessor} from "./DataCollectionProcessor";
import EventBus from "./EventBus";
import EventListener from "./EventListener";

export default class DataCollectionExecutive extends DataCollectionProcessor {

    public start() {
        const event = new DataCollectionStarted("DataCollection", "111111");
        this.publish(event).then(() => global.log.info("Data collection started"));
    }

    public on(event: DomainEvent): void {
        global.log.info("Data collection finished");
    }
}
