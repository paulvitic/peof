import {Environment} from "./environment";
import startEventBus from "./eventBus";
import DataCollectionExecutive from "../domain/DataCollectionExecutive";
import NewTicketsCollector from "../domain/NewTicketsCollector";
import DataCollectionService from "../application/DataCollectionService";
import EventBus from "../domain/EventBus";
import JobScheduler from "../infrastructure/job/JobScheduler";

export class Container {
    private constructor(
        readonly eventBus: EventBus,
        readonly dataCollectionExecutive: DataCollectionExecutive,
        readonly newTicketsCollector: NewTicketsCollector,
        readonly dataCollectionService: DataCollectionService,
        readonly joScheduler: JobScheduler,
    ) {}

    static async build(config: Environment) {

        const eventBus = await startEventBus();

        const dataCollectionExecutive = new DataCollectionExecutive(eventBus);
        const newTicketsCollector = new NewTicketsCollector(eventBus);

        const dataCollectionService = new DataCollectionService(dataCollectionExecutive, eventBus);

        eventBus.subscribe("DataCollectionStarted", newTicketsCollector);
        eventBus.subscribe("NewTicketsCollected", dataCollectionExecutive);

        const jobScheduler = await new JobScheduler(config.DATA_COLLECTION_CRON, dataCollectionService);

        return new Container(
            eventBus,
            dataCollectionExecutive,
            newTicketsCollector,
            dataCollectionService,
            jobScheduler,
        );
    }
}
