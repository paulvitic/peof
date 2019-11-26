import ApplicationService from "./ApplicationService";
import EventBus from "../domain/EventBus";
import DataCollectionExecutive from "../domain/DataCollectionExecutive";

export default class DataCollectionService extends ApplicationService {

    constructor (private readonly processor: DataCollectionExecutive,
                 eventBus: EventBus){
        super(eventBus);
    }

    collectData(): void {
       global.log.info("Service starting data collection.");
       this.processor.start();
    }
}
