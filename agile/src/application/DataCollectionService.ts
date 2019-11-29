import ApplicationService from "./ApplicationService";
import EventBus from "../domain/EventBus";
import DataCollectionExecutive from "../domain/DataCollectionExecutive";

export default class DataCollectionService extends ApplicationService {

    constructor (private readonly executive: DataCollectionExecutive,
                 eventBus: EventBus){
        super(eventBus);
    }

    start(): void {
       global.log.info("Service starting data collection.");
       this.executive.start().onSuccess(()=> global.log.info("Service started data collection."));
    }
}
