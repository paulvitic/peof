import {AggregateRoot} from "./AggregateRoot";
import DomainEvent from "./DomainEvent";
import {TicketCreated, TicketMovedToAnotherProject, TicketStatusChanged, TicketTypeChanged} from "./TicketEvent";

export class Identifier {
    private constructor(readonly id: string,
                        readonly name: string) {
    }
    static from = (id: string, name: string) => {
        return new Identifier(id, name)
    };

    equals = (other: Identifier) => {
        return this.name === other.name && this.id === other.id
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

    static fromEvents = (id: string, events: DomainEvent[]): Ticket => {
        const ticket = new Ticket(id);
        for (let event of events){
            switch (event.eventType()) {
                case TicketCreated.name:
                    ticket.onTicketCreated(event as TicketCreated);
                    break;
                case TicketMovedToAnotherProject.name:
                    ticket.onMovedToAnotherProject(event as TicketMovedToAnotherProject);
                    break;
                case TicketTypeChanged.name:
                    ticket.onTicketTypeChange(event as TicketTypeChanged);
                    break;
                case TicketStatusChanged.name:
                    ticket.onTicketStatusChange(event as TicketStatusChanged);
                    break;
                default:
            }
        }
        if(ticket !== undefined) return ticket;
        else throw new Error;
    };

    evaluateUpdate = (updateData: TicketProperties): void => {
        if (this.isNotInitialized()){
            let event = new TicketCreated(
                this.type,
                this.id,
                updateData.key,
                updateData.created,
                updateData.updated,
                updateData.project,
                updateData.issueType,
                updateData.status,
                updateData.sprints,
                updateData.labels,
                updateData.assignee);
            this.onTicketCreated(event);
            this.recordEvent(event)
        }
        this.evaluateProjectUpdate(updateData);
        this.evaluateIssueTypeUpdate(updateData);
        this.evaluateStatusUpdate(updateData);
        this.evaluateSprintUpdate(updateData);
        this.evaluateLabelUpdate(updateData);
        this.evaluateAssigneeUpdate(updateData);
    };

    private isNotInitialized = (): boolean => {
        return !this.key || !this.created;
    };

    private onTicketCreated = (event: TicketCreated): void => {
        this.key = event.key;
        this.created = event.created;
        this.updated = event.updated;
        this.project = event.project;
        this.issueType = event.issueType;
        this.status = event.status;
        this.sprints = event.sprints;
        this.labels = event.labels;
        this.assignee = event.assignee;
    };

    private evaluateProjectUpdate = (updateData: TicketProperties): void => {
        if (this.project && !this.project.equals(updateData.project)){
            let event = new TicketMovedToAnotherProject(
                this.type,
                this.id,
                updateData.updated,
                this.project,
                updateData.project
            );
            this.onMovedToAnotherProject(event);
            this.recordEvent(event)
        }
    };

    private onMovedToAnotherProject = (event: TicketMovedToAnotherProject): void => {
        this.updated = event.updated;
        this.project = event.currentProject;
    };

    private evaluateIssueTypeUpdate = (updateData: TicketProperties) => {
        if (this.issueType && !this.issueType.equals(updateData.issueType)) {
            let event = new TicketTypeChanged(
                this.type,
                this.id,
                updateData.updated,
                this.issueType,
                updateData.issueType
            );
            this.onTicketTypeChange(event);
            this.recordEvent(event)
        }
    };

    private onTicketTypeChange = (event: TicketTypeChanged) => {
        this.updated = event.updated;
        this.issueType = event.currentIssueType;
    };

    private evaluateStatusUpdate = (updateData: TicketProperties) => {
        if (this.status && !this.status.equals(updateData.status)) {
            let event = new TicketStatusChanged(
                this.type,
                this.id,
                updateData.updated,
                this.status,
                updateData.status
            );
            this.onTicketStatusChange(event);
            this.recordEvent(event)
        }
    };

    private onTicketStatusChange = (event: TicketStatusChanged) => {
        this.updated = event.updated;
        this.status = event.currentStatus;
    };

    private evaluateSprintUpdate = (updateData: TicketProperties) => {

    };

    private evaluateLabelUpdate = (updateData: TicketProperties) => {

    };

    private evaluateAssigneeUpdate = (updateData: TicketProperties) => {

    };
}
