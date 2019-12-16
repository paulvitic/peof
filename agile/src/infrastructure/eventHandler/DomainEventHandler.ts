import {TicketUpdatesCollected} from "../../domain/DataCollectionEvent";
import TicketService, {UpdateTicketCommand} from "../../application/TicketService";

export class DomainEventHandler {
    constructor(private readonly ticketService:TicketService) {}

    whenTicketUpdatesAreCollected = (event: TicketUpdatesCollected) => {
        for (let update of event.updates) {
            this.ticketService.updateTicket(new UpdateTicketCommand(update));
        }
    }
}
