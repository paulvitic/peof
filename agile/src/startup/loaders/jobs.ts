import config from '../config';
import JobScheduler from "../../infrastructure/job/JobScheduler";
import DataCollectionService from "../../application/DataCollectionService";
import DataCollectionExecutive from "../../domain/DataCollectionExecutive";
import LocalEventPublisher from "../../infrastructure/message/LocalEventPublisher";

export default () => {
    new JobScheduler(
        config.dataCollectionCron,
        new DataCollectionService(new DataCollectionExecutive(), new LocalEventPublisher())
    );
}