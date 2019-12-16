import ApplicationService from "./ApplicationService";
import EventBus from "../domain/EventBus";
import DataCollectionExecutive from "../domain/DataCollectionExecutive";
import DomainEvent from "../domain/DomainEvent";

export default class DataCollectionService extends ApplicationService {

    constructor (private readonly executive: DataCollectionExecutive,
                 eventBus: EventBus){
        super(eventBus);
    }

    start(forChangesSince: Date): void {
       global.log.info("Service starting data collection.");
       this.executive.start(forChangesSince)
           .onSuccess(() => global.log.info("Service started data collection"))
           .else((error) => global.log.error(error.reason));
    }
}
