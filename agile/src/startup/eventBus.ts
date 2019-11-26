import LocalEventBus from "../infrastructure/message/LocalEventBus";
import EventBus from "../domain/EventBus";

export default (): EventBus => {
    return new LocalEventBus();
}
