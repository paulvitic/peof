import DataCollectionClient from "../../domain/DataCollectionClient";
import request, {Response} from 'request';
import { Convert } from "./JiraTranslator";
import DomainEvent from "../../domain/DomainEvent";
import {UpdatedTicketsFound} from "../../domain/DataCollectionEvent";
import {JiraIssue} from "../../domain/Ticket";

/**
 *
 */
export default class JiraClient implements DataCollectionClient {
    private readonly and ="AND ";
    private readonly openTickets = "status not in (Closed, Done) ";
    private readonly projects = "project in (Contact) ";
    private readonly createdAfter = "createdDate >= ";

    constructor(private readonly jiraUrl: string,
                private readonly jiraUser: string,
                private readonly jiraApiToken: string) {}

    ticketsUpdatedSince(date: Date, publishUpdatesUsing: (updates: JiraIssue[]) => void): void {
        const query = "?jql=" + encodeURI(
            this.openTickets + this.and +
            this.projects + this.and +
            this.createdAfter + this.toDateString(date));
        const fields = "&fields=created,updated,statuscategorychangedate,project,issuetype,labels,assignee,status,customfield_10010";
        const url = this.jiraUrl + query + fields;

        const Authorization = `Basic ${Buffer.from(this.jiraUser + ":" + this.jiraApiToken).toString("base64")}`;
        request({url, headers: {Authorization}, json: true}, this.handleResponse(publishUpdatesUsing));
    }

    private handleResponse = (publishUpdatesUsing: (updates: JiraIssue[]) => void): (error: any, response: request.Response, body: object) => void => {
        return (error: any, response: Response, body: object) => {
            if (error) {
                console.error(error.message);
            } else {
                const issues = Convert.toIssues(body);
                global.log.info(`${issues.total} issue updates found.`);
                publishUpdatesUsing(issues.issues);
            }
        };
    };

    private toDateString = (date: Date) => {
        const d = date.getDate();
        const m = date.getMonth() + 1; //Month from 0 to 11
        const y = date.getFullYear();
        return `"${y}/${ m<=9 ? '0'+m : m }/${ d <= 9 ? '0'+d : d}"`;
    }
}
