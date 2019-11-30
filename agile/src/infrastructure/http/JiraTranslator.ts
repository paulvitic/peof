type IdentityProperties = {
    readonly id: string,
    readonly name: string
}

class Identity {
    private constructor(props: IdentityProperties) {
    }
    static from = (props: IdentityProperties) => {
        return new Identity(props)
    }
}

type JiraUserProperties = {
    readonly name: string,
    readonly accountId: string
}

class JiraUser {
    private constructor(props: JiraUserProperties) {
    }
    static from = (props: JiraUserProperties | undefined): JiraUser | null => {
        if (props) {
            return new JiraUser(props);
        }
        return null;
    }
}

class JiraSprint {
    constructor(
        readonly id: string | undefined,
        readonly name: string | undefined,
        readonly state: string | undefined) {
    }

    static fromString = (str: string[]): JiraSprint[] => {
        const sprints = new Array<JiraSprint>();
        if (str && str.length > 0) {
            for (let s of str) {
                sprints.push(JiraSprint.parseSprint(s));
            }
        }
        return sprints;
    };

    static parseSprint = (s: string): JiraSprint => {
        const regex = /id=(?<id>[^,]+),{1}|state=(?<state>[^,]+),{1}|name=(?<name>[^,]+),{1}/g;
        const [tag1, tag2, tag3] = s.matchAll(regex);
        const sprintId = tag1 && tag1.groups ? tag1.groups.id : undefined;
        const sprintState = tag2 && tag2.groups ? tag2.groups.state : undefined;
        const sprintName = tag3 && tag3.groups ? tag3.groups.name : undefined;
        return new JiraSprint(sprintId, sprintState, sprintName);
    }
}

class JiraIssue {
    constructor(
        readonly id: string,
        readonly key: string,
        readonly created: Date,
        readonly updated: Date,
        readonly project: Identity,
        readonly issueType: Identity,
        readonly status: Identity,
        readonly sprints: JiraSprint[],
        readonly labels: string[],
        readonly assignee: JiraUser | null) {
    }
}

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


