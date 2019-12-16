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
import {DomainEventHandler} from "../infrastructure/eventHandler/DomainEventHandler";
import TicketService from "../application/TicketService";

export class Container {
    private constructor(
        readonly eventBus: EventBus,
        readonly dataCollectionExecutive: DataCollectionTracker,
        readonly updatedTicketsCollector: UpdatedTicketsCollector,
        readonly dataCollectionService: DataCollectionService,
        readonly jobScheduler: JobScheduler,
        readonly dataCollectionMonitor : DataCollectionMonitor,
        readonly ticketService: TicketService,
        readonly domainEventHandler: DomainEventHandler
    ) {}

    static async build(config: Environment) {

        const eventBus = await startEventBus();
        const dataCollectionRepo = new DataCollectionFileRepo("./test/data/dataCollection");
        const eventStore = new FileEventStore("./data/eventLog");

        const dataCollectionTracker = new DataCollectionTracker(eventStore, eventBus);
        const dataCollectionMonitor = new FileDataCollectionMonitor();
        const dataCollectionExecutive = new DataCollectionExecutive(dataCollectionMonitor, dataCollectionTracker);
        const dataCollectionService = new DataCollectionService(dataCollectionExecutive, eventBus);
        const updatedTicketsCollector = new UpdatedTicketsCollector(
            new JiraClient(config.JIRA_URL, config.JIRA_USER, config.JIRA_API_TOKEN),
            eventBus);
        const ticketService = new TicketService(eventStore, eventBus);
        const domainEventHandler = new DomainEventHandler(ticketService);

        eventBus.subscribe(DataCollectionStarted.name, updatedTicketsCollector.whenDataCollectionStarts);
        eventBus.subscribe(TicketUpdatesCollected.name, dataCollectionTracker.whenTicketUpdatesAreCollected);
        eventBus.subscribe(DataCollectionStarted.name, dataCollectionMonitor.onEvent);
        eventBus.subscribe(DataCollectionFinished.name, dataCollectionMonitor.onEvent);
        eventBus.subscribe(TicketUpdatesCollected.name, domainEventHandler.whenTicketUpdatesAreCollected);

        const jobScheduler = await new JobScheduler(config.DATA_COLLECTION_CRON, dataCollectionService);

        return new Container(
            eventBus,
            dataCollectionTracker,
            updatedTicketsCollector,
            dataCollectionService,
            jobScheduler,
            dataCollectionMonitor,
            ticketService,
            domainEventHandler

        );
    }
}
