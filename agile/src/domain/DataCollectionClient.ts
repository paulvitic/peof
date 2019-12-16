import {Ticket, TicketProperties} from "./Ticket";

export default interface DataCollectionClient {
    fetchUpdatedTicketsSince(date: Date, handle: (updates: TicketProperties[]) => void) : void;
}
