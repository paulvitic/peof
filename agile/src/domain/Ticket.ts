import {AggregateRoot} from "./AggregateRoot";
import DomainEvent from "./DomainEvent";
import {TicketCreated} from "./TicketEvent";

export class Identifier {
    private constructor(readonly id: string,
                        readonly name: string) {
    }
    static from = (id: string, name: string) => {
        return new Identifier(id, name)
    }
}

export class TicketUser {
    private constructor(readonly name: string,
                        readonly accountId: string ) {}

    static from = (name: string, accountId: string): TicketUser | null => {
        if (name && accountId) {
            return new TicketUser(name, accountId);
        }
        return null;
    }
}

export class Sprint {
    private constructor(readonly id: string,
                        readonly name: string,
                        readonly state: string) {}

    public static from(id: string | undefined,
                       name: string | undefined,
                       state: string | undefined): Sprint | null {
        if (id && name && state) return new Sprint(id, name, state);
        return null;
    }
}

export type TicketProperties = {
    readonly id: string,
    readonly key: string,
    readonly created: Date,
    readonly updated: Date,
    readonly project: Identifier,
    readonly issueType: Identifier,
    readonly status: Identifier,
    readonly sprints: Sprint[],
    readonly labels: string[],
    readonly assignee: TicketUser | null
}

export class Ticket extends AggregateRoot {
    private key: string | undefined;
    private created: Date | undefined;
    private updated: Date | undefined;
    private project: Identifier | undefined;
    private issueType: Identifier| undefined;
    private status: Identifier| undefined;
    private sprints: Sprint[]| undefined;
    private labels: string[]| undefined;
    private assignee: TicketUser | null | undefined;

    private constructor(id: string) {
        super(id);
    }

    static fromEvents(id: string, events: DomainEvent[]): Ticket {
        const ticket = new Ticket(id);
        for (let event of events){
            switch (event.eventType()) {
                case TicketCreated.name:
                    ticket.onTicketCreated(event as TicketCreated);
                    break;
                default:
            }
        }
        if(ticket !== undefined) return ticket;
        else throw new Error;
    }

    private create(props: TicketProperties){

    }

    evaluateUpdate(updateData: TicketProperties){
        if (this.isNotInitialized()){
            let event = new TicketCreated(this.type, this.id, updateData);
            this.onTicketCreated(event);
            this.recordEvent(event)
        }

    }

    private onTicketCreated(event: TicketCreated) {
        this.key = event.ticketProps.key;
        this.created = event.ticketProps.created;
        this.updated = event.ticketProps.updated;
        this.project = event.ticketProps.project;
        this.issueType = event.ticketProps.issueType;
        this.status = event.ticketProps.status;
        this.sprints = event.ticketProps.sprints;
        this.labels = event.ticketProps.labels;
        this.assignee = event.ticketProps.assignee;
    }

    private isNotInitialized() {
        return !this.key || !this.created || this.updated;
    }
}
