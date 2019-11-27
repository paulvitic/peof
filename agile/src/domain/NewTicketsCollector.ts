import DataCollectionStarted from "./DataCollectionStarted";
import NewTicketsCollected from "./NewTicketsCollected";
import {DataCollectionProcessor} from "./DataCollectionProcessor";
import EventBus from "./EventBus";
import TicketDataCollector from "./TicketDataCollector";

export default class NewTicketsCollector extends DataCollectionProcessor {


    constructor(private readonly ticketDataCollector: TicketDataCollector,
                eventBus: EventBus) {
        super(eventBus);
    }

    public on = (event: DataCollectionStarted): void => {
        switch(event.eventType()) {
            case "DataCollectionStarted": {
                this.collectNewStartedTickets(event.aggregateId());
                break;
            }
            default: {
                global.log.warn("Dont know event type " + event.eventType());
                break;
            }
        }
    };

    private collectNewStartedTickets = (aggregateId: string) =>  {
        this.ticketDataCollector.ticketsCreatedSince(new Date());
        const newEvent = new NewTicketsCollected("DataCollection", aggregateId);
        this.publish(newEvent).then(() => global.log.info("Newly created ticket data collected"));
    }
}
