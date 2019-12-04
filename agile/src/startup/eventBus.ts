import LocalEventBus from "../infrastructure/message/LocalEventBus";
import EventBus from "../domain/EventBus";
import FileBasedEventStore from "../infrastructure/persistence/FileBasedEventStore";

export default (): EventBus => {
    return new LocalEventBus(new FileBasedEventStore("./data/eventLog"));
}
