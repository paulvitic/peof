import {Identifier, Sprint, TicketUser, TicketProperties} from "../../domain/Ticket";

export class JiraIssues {
    readonly issues = new Array<TicketProperties>();

    constructor(readonly startAt: number,
                readonly maxResults: number,
                readonly total: number) {
    }

    addIssue = (issue: TicketProperties) => {
        this.issues.push(issue)
    }
}

export class Convert {
    public static toIssues(json: any): JiraIssues {
        const issues = new JiraIssues(json.startAt, json.maxResults, json.total);

        for (let issue of json.issues) {
            issues.addIssue({
                    id : issue.id,
                    key: issue.key,
                    created: new Date(issue.fields.created),
                    updated: new Date(issue.fields.updated),
                    project: Identifier.from(issue.fields.project.id, issue.fields.project.name),
                    issueType: Identifier.from(issue.fields.issuetype.id, issue.fields.issuetype.name),
                    status: Identifier.from(issue.fields.status.id, issue.fields.status.name),
                    sprints: this.deSerializeSprints(issue.fields.customfield_10010, this.deSerializeSprint),
                    labels: issue.fields.labels,
                    assignee: this.deSerializeAssignee(issue.fields.assignee)
            })
        }
        return issues;
    }

    private static deSerializeSprints = (serials: string[], deSerializer: (serial: string) => Sprint | null): Sprint[] => {
        const sprints = new Array<Sprint>();
        if (serials && serials.length > 0) {
            for (let serial of serials) {
                let sprint = deSerializer(serial);
                if (sprint) sprints.push(sprint);
            }
        }
        return sprints;
    };

    private static deSerializeSprint = (serial: string): Sprint | null=> {
        const regex = /id=(?<id>[^,]+),{1}|state=(?<state>[^,]+),{1}|name=(?<name>[^,]+),{1}/g;

        const [tag1, tag2, tag3] = serial.matchAll(regex);

        const id = tag1 && tag1.groups ? tag1.groups.id : undefined;
        const state = tag2 && tag2.groups ? tag2.groups.state : undefined;
        const name = tag3 && tag3.groups ? tag3.groups.name : undefined;

        return Sprint.from(id, state, name);
    };

    private static deSerializeAssignee = (assignee: {name: string, accountId:string}) => {
        if (assignee) return TicketUser.from(assignee.name, assignee.accountId);
        else return null
    }
}


