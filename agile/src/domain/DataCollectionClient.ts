export default interface DataCollectionClient {
    ticketsCreatedSince(date: Date): void;
}
