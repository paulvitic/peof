import TicketDataCollector from "../../domain/TicketDataCollector";
import request, {Response} from 'request';
import { Convert } from "./JiraTranslator";

export default class JiraClient implements TicketDataCollector {

    private readonly and ="AND ";
    private readonly openTickets = "status not in (Closed, Done) ";
    private readonly projects = "project in (Contact) ";
    private readonly createdAfter = "createdDate >= ";

    constructor(private readonly jiraUrl: string,
                private readonly jiraUser: string,
                private readonly jiraApiToken: string) {}

    ticketsCreatedSince(date: Date) {
        const query = "?jql=" + encodeURI(
            this.openTickets + this.and +
            this.projects + this.and +
            this.createdAfter + this.toDateString(date));
        const fields = "&fields=created,updated,statuscategorychangedate,project,issuetype,labels,assignee,status,customfield_10010";
        const url = this.jiraUrl + query + fields;

        const Authorization = `Basic ${Buffer.from(this.jiraUser + ":" + this.jiraApiToken).toString("base64")}`;

        global.log.info(Authorization);

        request({url, headers: {Authorization}, json: true}, this.handle);
    }

    private handle = (error: any, response: Response, body: object) => {
        if (error) {
            console.error(error.message);
        } else {
            const issues = Convert.toIssues(body);
            console.log(JSON.stringify(issues, null, 2));
        }
    };

    private toDateString = (date: Date) => {
        const d = date.getDate();
        const m = date.getMonth() + 1; //Month from 0 to 11
        const y = date.getFullYear();
        return `"${y}/${ m<=9 ? '0'+m : m }/${ d <= 9 ? '0'+d : d}"`;
    }
}
