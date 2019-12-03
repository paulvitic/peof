import {AbstractDomainEvent, EventRegistry} from "../../src/domain/DomainEvent";

class TestEvent extends AbstractDomainEvent {
    constructor(aggregate: string, aggregateId: string,
                readonly someProperty: string) {
        super(aggregate, aggregateId);
    }
}

EventRegistry.addEventType(TestEvent.name, TestEvent);

// http://choly.ca/post/typescript-json/
test('should get failure value', () => {
    const jsonString = `{"_aggregate":"TestAggregate","_aggregateId":"1111","_eventType":"TestEvent","_generatedOn":"2019-12-02T17:18:04.511Z","someProperty":"someProperty"}`;
    const event = EventRegistry.fromJson(jsonString);
    console.log(event);
    if (event) console.log(event.eventType());
});
