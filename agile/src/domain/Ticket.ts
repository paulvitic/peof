type IdentityProperties = {
    readonly id: string,
    readonly name: string
}

export class Identity {
    private constructor(props: IdentityProperties) {
    }
    static from = (props: IdentityProperties) => {
        return new Identity(props)
    }
}

type TicketUserProperties = {
    readonly name: string,
    readonly accountId: string
}

export class TicketUser {
    private constructor(props: TicketUserProperties) {}

    static from = (props: TicketUserProperties | undefined): TicketUser | null => {
        if (props) {
            return new TicketUser(props);
        }
        return null;
    }
}

type SprintProperties = {
    readonly id: string | undefined,
    readonly name: string | undefined,
    readonly state: string | undefined
}


export class Sprint {
    private constructor(props: SprintProperties) {}

    public static from(props: SprintProperties){
        return new Sprint(props);
    }
}

type TicketProperties = {
    readonly id: string,
    readonly key: string,
    readonly created: Date,
    readonly updated: Date,
    readonly project: Identity,
    readonly issueType: Identity,
    readonly status: Identity,
    readonly sprints: Sprint[],
    readonly labels: string[],
    readonly assignee: TicketUser | null
}

export class Ticket {
    constructor(props: TicketProperties) {}
}
