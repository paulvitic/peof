import {Ticket} from "./Ticket";

/**
 *
 */
export default interface DataCollectionClient {
    ticketsUpdatedSince(date: Date, handle: (updates: Ticket[]) => void) : void;
}
