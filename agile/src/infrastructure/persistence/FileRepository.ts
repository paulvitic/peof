import fs from "fs"
import {Repository} from "../../domain/Repository";
import {AggregateRoot} from "../../domain/AggregateRoot";
import DataCollection from "../../domain/DataCollection";

/**
 *
 */
export abstract class FileRepository<T extends AggregateRoot> implements Repository<T> {
    constructor(private readonly rootPath: string) {}

    delete(id: string): Promise<boolean> {
        try {
            fs.unlinkSync(`${this.rootPath}/${id}.json`);
        } catch (err) {
            global.log.error(err);
            new Promise<boolean>((resolve) => {
                resolve(false);
            });
        }
        return new Promise<boolean>((resolve) => {
            resolve(true);
        });
    }

    find(item: T): Promise<T[]> {
        return new Promise<T[]>((resolve) => {
            resolve(new Array<T>());
        });
    }

    findOne(id: string): Promise<T> {
        let result: T;
        try {
            const rawData = fs.readFileSync(`${this.rootPath}/${id}.json`);
            result = JSON.parse(rawData.toString());
            return new Promise<T>((resolve) => {
                resolve(result);
            });
        } catch (err) {
            throw new Error(err);
        }
    }

    save(item: T): Promise<T> {
        try {
            let data = JSON.stringify(item);
            fs.writeFileSync(`${this.rootPath}/${item.id}.json`, data);
            return new Promise<T>((resolve) => {
                resolve(item);
            });
        } catch (err) {
            throw new Error(err);
        }
    }

    update(id: string, item: T): Promise<T> {
        try {
            let data = JSON.stringify(item, null, 4);
            fs.writeFileSync(`${this.rootPath}/${item.id}.json`, data);
            return new Promise<T>((resolve) => {
                resolve(item);
            });
        } catch (err) {
            throw new Error(err);
        }
    }
}

export class DataCollectionFileRepo extends FileRepository<DataCollection> {}
