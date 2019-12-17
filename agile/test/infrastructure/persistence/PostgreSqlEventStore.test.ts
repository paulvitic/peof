import PostgreSqlEventStore from "../../../src/infrastructure/persistence/PostgreSqlEventStore";
import {AbstractDomainEvent, EventRegistry} from "../../../src/domain/DomainEvent";
import {getEnvironment} from "../../../src/startup/environment";
import logger from "../../../src/startup/logger";

export class TestEvent extends AbstractDomainEvent {
    constructor(aggregate: string, aggregateId: string,
                readonly someProperty: string) {
        super(aggregate, aggregateId);
    }
}

EventRegistry.addEventType(TestEvent.name, TestEvent);

beforeAll(async () => {
    const config = await getEnvironment();
    await logger(config);

});

test('should log event', async () => {
    let eventStore = new PostgreSqlEventStore();
    try {
        await eventStore.logEvent(new TestEvent("TestAggregate", "111119", "someProperty"));
    } catch (e) {
        console.log(e)
    }
});

test('should retrieve events', async () => {
    const config = await getEnvironment();
    await logger(config);
    let eventStore = new PostgreSqlEventStore();
    try {
        await eventStore.eventsOfAggregate("TestAggregate", "111119");
    } catch (e) {
        console.log(e)
    }
});
