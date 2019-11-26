import DataCollectionStarted from "./DataCollectionStarted";
import NewTicketsCollected from "./NewTicketsCollected";
import {DataCollectionProcessor} from "./DataCollectionProcessor";
import EventBus from "./EventBus";

export default class NewTicketsCollector extends DataCollectionProcessor {

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
        const newEvent = new NewTicketsCollected("DataCollection", aggregateId);
        this.publish(newEvent);
        global.log.info("Newly created ticket data collected");
    }
}
