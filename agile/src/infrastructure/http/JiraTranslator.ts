import {Identity, JiraIssue, JiraSprint, JiraUser} from "../../domain/Ticket";

export class JiraIssues {
    readonly issues = new Array<JiraIssue>();

    constructor(readonly startAt: number,
                readonly maxResults: number,
                readonly total: number) {
    }

    addIssue = (issue: JiraIssue) => {
        this.issues.push(issue)
    }
}

export class Convert {
    public static toIssues(json: any): JiraIssues {

        const issues = new JiraIssues(json.startAt, json.maxResults, json.total);

        for (let issue of json.issues) {
            issues.addIssue(new JiraIssue(
                issue.id,
                issue.key,
                new Date(issue.fields.created),
                new Date(issue.fields.updated),
                Identity.from(issue.fields.project),
                Identity.from(issue.fields.issuetype),
                Identity.from(issue.fields.status),
                JiraSprint.fromString(issue.fields.customfield_10010),
                issue.fields.labels,
                JiraUser.from(issue.fields.assignee))
            )
        }
        return issues;
    }
}


