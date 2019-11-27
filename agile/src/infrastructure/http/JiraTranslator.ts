
class Identity {
    constructor(readonly id: string,
                readonly name: string) {}
}

class JiraUser {
    constructor(readonly name: string,
                readonly accountId: string) {}
}

class Sprint {
    constructor(
        readonly id: string | undefined,
        readonly name: string | undefined,
        readonly state: string | undefined) {}

    static fromString = (str: string[]): Sprint[] =>  {
        const regex = /id=(?<id>[^,]+),{1}|state=(?<state>[^,]+),{1}|name=(?<name>[^,]+),{1}/g;
        const sprints = new Array<Sprint>();
        if (str && str.length > 0){
            for (let s of str) {
                const [tag1, tag2, tag3] = s.matchAll(regex);
                if (tag1 && tag2 && tag3) {
                    sprints.push(new Sprint(
                        tag1.groups ? tag1.groups.id : undefined,
                        tag2.groups ? tag2.groups.state : undefined,
                        tag3.groups ? tag3.groups.name : undefined));
                }
            }
        }
        return sprints;
    }
}

class Issue {
    constructor(
        readonly id: string,
        readonly key: string,
        readonly created: Date,
        readonly updated: Date,
        readonly project: Identity,
        readonly issueType: Identity,
        readonly status: Identity,
        readonly sprints: Sprint[],
        readonly labels: string[],
        readonly assignee: JiraUser | null) {
    }
}

export class Issues {
    readonly issues = new Array<Issue>();
    constructor(readonly startAt: number,
                readonly maxResults: number,
                readonly total: number) {}
    addIssue = (issue: Issue) => {
        this.issues.push(issue)
    }
}

export class Convert {
    public static toIssues(json: any): Issues {
        const issues = new Issues(json.startAt, json.maxResults, json.total);
        for (let issue of json.issues) {
            issues.addIssue(new Issue(
                issue.id,
                issue.key,
                new Date(issue.fields.created),
                new Date(issue.fields.updated),
                new Identity(issue.fields.project.id, issue.fields.project.name),
                new Identity(issue.fields.issuetype.id, issue.fields.issuetype.name),
                new Identity(issue.fields.status.id, issue.fields.status.name),
                Sprint.fromString(issue.fields.customfield_10010),
                issue.fields.labels,
                issue.fields.assignee ? new JiraUser(issue.fields.assignee.name, issue.fields.assignee.accountId) : null
                )
            )
        }
        return issues;
    }
}


