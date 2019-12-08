import LocalEventBus from "../infrastructure/message/LocalEventBus";
import EventBus from "../domain/EventBus";
import FileEventStore from "../infrastructure/persistence/FileEventStore";

export default (): EventBus => {
    return new LocalEventBus(new FileEventStore("./data/eventLog"));
}
