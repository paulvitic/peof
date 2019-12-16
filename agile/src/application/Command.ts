import {AggregateRoot} from "../domain/AggregateRoot";

export default abstract class Command<T extends AggregateRoot> {
    abstract executeOn(aggregate: T): T | void
}
