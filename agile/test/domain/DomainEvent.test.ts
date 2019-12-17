import {AbstractDomainEvent, EventRegistry} from "../../src/domain/DomainEvent";

class TestEvent extends AbstractDomainEvent {
    constructor(aggregate: string, aggregateId: string,
                readonly someProperty: string) {
        super(aggregate, aggregateId);
    }
}

EventRegistry.addEventType(TestEvent.name, TestEvent);

test('should convert json to right domain event type', () => {
    const jsonString = `{"_aggregate":"TestAggregate","_aggregateId":"1111","_eventType":"TestEvent","_generatedOn":"2019-12-02T17:18:04.511Z","someProperty":"someProperty"}`;
    const event = EventRegistry.fromJsonString(jsonString);
    expect(event.constructor.name).toBe("TestEvent");
    expect(event.eventType()).toBe("TestEvent");
});
