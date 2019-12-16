import {Ticket, TicketProperties} from "../domain/Ticket";
import Command from "./Command";
import EventStore from "../domain/EventStore";
import ApplicationService from "./ApplicationService";
import EventBus from "../domain/EventBus";

export class UpdateTicketCommand extends Command<Ticket>{
    constructor(readonly updatedData: TicketProperties) {
        super();
    }

    executeOn(ticket: Ticket): void {
        ticket.evaluateUpdate(this.updatedData);
    }
}

export default class TicketService extends ApplicationService {
    constructor(private readonly eventStore: EventStore,
                eventBus: EventBus) {
        super(eventBus)
    }

    updateTicket(command: UpdateTicketCommand) {
        this.eventStore.eventsOfAggregate(Ticket.name, command.updatedData.id)
            .then((events) => {
                const ticket = Ticket.fromEvents(command.updatedData.id, events);
                command.executeOn(ticket);
                this.publishEventsOf(ticket);
            });

    }
}
