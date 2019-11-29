import {Environment} from "./environment";
import startEventBus from "./eventBus";
import { DataCollectionTracker, UpdatedTicketsCollector } from "../domain/DataCollectionProcess";
import DataCollectionService from "../application/DataCollectionService";
import EventBus from "../domain/EventBus";
import JobScheduler from "../infrastructure/job/JobScheduler";
import JiraClient from "../infrastructure/http/JiraClient";
import {DataCollectionFileRepo, FileRepository} from "../infrastructure/persistence/FileRepository";
import DataCollectionExecutive from "../domain/DataCollectionExecutive";
import FakeDataCollectionView from "../infrastructure/persistence/FakeDataCollectionView";

export class Container {
    private constructor(
        readonly eventBus: EventBus,
        readonly dataCollectionExecutive: DataCollectionTracker,
        readonly newTicketsCollector: UpdatedTicketsCollector,
        readonly dataCollectionService: DataCollectionService,
        readonly joScheduler: JobScheduler,
    ) {}

    static async build(config: Environment) {

        const eventBus = await startEventBus();

        const dataCollectionRepo = new DataCollectionFileRepo("./test/data/dataCollection");
        const dataCollectionTracker = new DataCollectionTracker(eventBus, dataCollectionRepo);
        const dataCollectionView = new FakeDataCollectionView();
        const dataCollectionExecutive = new DataCollectionExecutive(dataCollectionRepo, dataCollectionView, dataCollectionTracker);
        const newTicketsCollector = new UpdatedTicketsCollector(
            new JiraClient(config.JIRA_URL, config.JIRA_USER, config.JIRA_API_TOKEN),
            eventBus);

        const dataCollectionService = new DataCollectionService(dataCollectionExecutive, eventBus);

        eventBus.subscribe("DataCollectionStarted", newTicketsCollector);
        eventBus.subscribe("NewTicketsCollected", dataCollectionTracker);

        const jobScheduler = await new JobScheduler(config.DATA_COLLECTION_CRON, dataCollectionService);

        return new Container(
            eventBus,
            dataCollectionTracker,
            newTicketsCollector,
            dataCollectionService,
            jobScheduler,
        );
    }
}
