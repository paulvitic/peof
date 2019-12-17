import {AbstractDomainEvent, EventRegistry} from "./DomainEvent";
import {Identifier, Sprint, TicketUser} from "./Ticket";

export class TicketCreated extends AbstractDomainEvent {
    constructor(aggregate: string,
                aggregateId: string,
                readonly key: string,
                readonly created: Date,
                readonly updated: Date,
                readonly project: Identifier,
                readonly issueType: Identifier,
                readonly status: Identifier,
                readonly sprints: Sprint[],
                readonly labels: string[],
                readonly assignee: TicketUser | null) {
        super(aggregate, aggregateId);
    }
}

EventRegistry.addEventType(TicketCreated.name, TicketCreated);

export class TicketMovedToAnotherProject extends AbstractDomainEvent {
    constructor(aggregate: string,
                aggregateId: string,
                readonly updated: Date,
                readonly previousProject: Identifier,
                readonly currentProject: Identifier) {
        super(aggregate, aggregateId);
    }
}

EventRegistry.addEventType(TicketMovedToAnotherProject.name, TicketMovedToAnotherProject);

export class TicketTypeChanged extends AbstractDomainEvent {
    constructor(aggregate: string,
                aggregateId: string,
                readonly updated: Date,
                readonly previousIssueType: Identifier,
                readonly currentIssueType: Identifier) {
        super(aggregate, aggregateId);
    }
}

EventRegistry.addEventType(TicketTypeChanged.name, TicketTypeChanged);

export class TicketStatusChanged extends AbstractDomainEvent {
    constructor(aggregate: string,
                aggregateId: string,
                readonly updated: Date,
                readonly previousStatus: Identifier,
                readonly currentStatus: Identifier) {
        super(aggregate, aggregateId);
    }
}

EventRegistry.addEventType(TicketStatusChanged.name, TicketStatusChanged);


