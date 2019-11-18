import ApplicationService from "./ApplicationService";
import DomainEventPublisher from "./DomainEventPublisher";
import DataCollectionExecutive from "../domain/DataCollectionExecutive";

export default class DataCollectionService extends ApplicationService {

    constructor (private processor: DataCollectionExecutive,
                 eventPublisher: DomainEventPublisher){
        super(eventPublisher);
    }

    collectData() {
       global.log.info("Service collecting data");
       this.publish(this.processor.start());
    }
}