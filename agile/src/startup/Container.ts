import {Environment} from "./environment";
import startEventBus from "./eventBus";
import { DataCollectionTracker, UpdatedTicketsCollector } from "../domain/DataCollectionProcess";
import DataCollectionService from "../application/DataCollectionService";
import EventBus from "../domain/EventBus";
import JobScheduler from "../infrastructure/job/JobScheduler";
import JiraClient from "../infrastructure/http/JiraClient";
import {DataCollectionFileRepo, FileRepository} from "../infrastructure/persistence/FileRepository";
import DataCollectionExecutive from "../domain/DataCollectionExecutive";
import FileDataCollectionMonitor from "../infrastructure/persistence/FileDataCollectionMonitor";
import {DataCollectionStarted, DataCollectionFinished, TicketUpdatesCollected} from "../domain/DataCollectionEvent";
import FileEventStore from "../infrastructure/persistence/FileEventStore";
import {DataCollectionMonitor} from "../domain/DataCollectionMonitor";

export class Container {
    private constructor(
        readonly eventBus: EventBus,
        readonly dataCollectionExecutive: DataCollectionTracker,
        readonly newTicketsCollector: UpdatedTicketsCollector,
        readonly dataCollectionService: DataCollectionService,
        readonly joScheduler: JobScheduler,
        readonly dataCollectionMonitor : DataCollectionMonitor
    ) {}

    static async build(config: Environment) {

        const eventBus = await startEventBus();

        const dataCollectionRepo = new DataCollectionFileRepo("./test/data/dataCollection");
        const eventStore = new FileEventStore("./data/eventLog");
        const dataCollectionTracker = new DataCollectionTracker(eventStore, eventBus);
        const dataCollectionMonitor = new FileDataCollectionMonitor();
        const dataCollectionExecutive = new DataCollectionExecutive(dataCollectionMonitor, dataCollectionTracker);
        const newTicketsCollector = new UpdatedTicketsCollector(
            new JiraClient(config.JIRA_URL, config.JIRA_USER, config.JIRA_API_TOKEN),
            eventBus);

        const dataCollectionService = new DataCollectionService(dataCollectionExecutive, eventBus);

        eventBus.subscribe(DataCollectionStarted.name, newTicketsCollector);
        eventBus.subscribe(TicketUpdatesCollected.name, dataCollectionTracker);
        eventBus.subscribe(DataCollectionStarted.name, dataCollectionMonitor);
        eventBus.subscribe(DataCollectionFinished.name, dataCollectionMonitor);

        const jobScheduler = await new JobScheduler(config.DATA_COLLECTION_CRON, dataCollectionService);

        return new Container(
            eventBus,
            dataCollectionTracker,
            newTicketsCollector,
            dataCollectionService,
            jobScheduler,
            dataCollectionMonitor
        );
    }
}
