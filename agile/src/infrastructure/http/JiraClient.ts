import DataCollectionClient from "../../domain/DataCollectionClient";
import {TicketUpdatesPublisher} from "../../domain/DataCollectionProcess";
import request, {Response} from 'request';
import { Convert } from "./JiraTranslator";

type RequestHandler = (error: any, response: request.Response, body: object) => void;

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

    fetchUpdatedTicketsSince = (date:Date, publishUpdatesUsing: TicketUpdatesPublisher): void => {
        const query = "?jql=" + encodeURI(
            this.openTickets + this.and +
            this.projects + this.and +
            this.createdAfter + this.toDateString(date));
        const fields = "&fields=created,updated,statuscategorychangedate,project,issuetype,labels,assignee,status,customfield_10010";
        const url = this.jiraUrl + query + fields;
        global.log.info(url);
        const Authorization = `Basic ${Buffer.from(this.jiraUser + ":" + this.jiraApiToken).toString("base64")}`;

        request({url, headers: {Authorization}, json: true}, this.responseHandler(publishUpdatesUsing));
    };

    private responseHandler = (publishUpdatesUsing: TicketUpdatesPublisher): RequestHandler => {
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
