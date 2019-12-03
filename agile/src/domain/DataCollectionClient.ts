import {Ticket} from "./Ticket";

/**
 *
 */
export default interface DataCollectionClient {
    fetchUpdatedTicketsSince(date: Date, handle: (updates: Ticket[]) => void) : void;
}
