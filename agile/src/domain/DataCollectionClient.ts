import {JiraIssue} from "./Ticket";

/**
 *
 */
export default interface DataCollectionClient {
    ticketsUpdatedSince(date: Date, handle: (updates: JiraIssue[]) => void) : void;
}
