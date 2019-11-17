import config from '../config';
import JobScheduler from "../../infrastructure/job/JobScheduler";
import DataCollectionService from "../../application/DataCollectionService";

export default () => {
    new JobScheduler(config.dataCollectionCron, new DataCollectionService());
}