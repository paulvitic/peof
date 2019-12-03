import {AbstractDomainEvent, EventRegistry} from "../../../src/domain/DomainEvent";
import FileBasedEventStore from "../../../src/infrastructure/persistence/FileBasedEventStore";

class TestEvent extends AbstractDomainEvent {
    constructor(aggregate: string, aggregateId: string,
                readonly someProperty: string) {
        super(aggregate, aggregateId);
    }
}

EventRegistry.addEventType(TestEvent.name, TestEvent);

// http://choly.ca/post/typescript-json/
test('should get failure value', () => {
    let testEvent = new TestEvent("TestAggregate", "1111","propertyValue");
    const eventStore = new FileBasedEventStore("./data/eventLog");
    eventStore.logEvent(testEvent);
    const events = eventStore.eventsOfAggregate("TestAggregate", "1111");
    for (let event of events) {
        console.log(event.eventType());
    }
});
