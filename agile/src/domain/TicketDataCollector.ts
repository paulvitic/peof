export default interface TicketDataCollector {
    ticketsCreatedSince(date: Date): void;
}
