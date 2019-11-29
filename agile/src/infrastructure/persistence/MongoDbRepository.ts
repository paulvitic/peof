import {Repository} from "../../domain/Repository";

export default abstract class MongoDbRepository<T> implements Repository<T> {

    abstract save(item: T): Promise<T>;

    abstract delete(id: string): Promise<boolean>;

    abstract find(item: T): Promise<T[]>;

    abstract findOne(id: string): Promise<T>;

    abstract update(id: string, item: T): Promise<T>;
}
