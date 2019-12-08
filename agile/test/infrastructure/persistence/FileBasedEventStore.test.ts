import {AbstractDomainEvent, EventRegistry} from "../../../src/domain/DomainEvent";
import FileEventStore from "../../../src/infrastructure/persistence/FileEventStore";

class TestEvent extends AbstractDomainEvent {
    constructor(aggregate: string, aggregateId: string,
                readonly someProperty: string) {
        super(aggregate, aggregateId);
    }
}

EventRegistry.addEventType(TestEvent.name, TestEvent);

test('should get failure value', () => {
    let testEvent = new TestEvent("TestAggregate", "1111","propertyValue");
    const eventStore = new FileEventStore("./data/eventLog");
    eventStore.logEvent(testEvent);
    const events = eventStore.eventsOfAggregate("TestAggregate", "1111");
    for (let event of events) {
        console.log(event.eventType());
    }
});
