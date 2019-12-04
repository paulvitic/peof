import fs from "fs"
import EventStore from "../../domain/EventStore";
import DomainEvent, {AbstractDomainEvent, EventRegistry} from "../../domain/DomainEvent";

export default class FileBasedEventStore implements EventStore {
    constructor(private readonly rootPath: string) {}

    eventsOfAggregate = (aggregate: string, aggregateId: string): DomainEvent[] => {
        const path = `${this.rootPath}/${aggregate}/${aggregateId}/`;
        const result = new Array<DomainEvent>();
        const files = fs.readdirSync(path);
        for (let file of files){
            let event = EventRegistry.fromJson(fs.readFileSync(path + file).toString());
            if (event) result.push(event);
        }
        return result;
    };

    eventsOfAggregateSince = (aggregate: string, aggregateId: string, since: Date):  DomainEvent[] => {
        return new Array<DomainEvent>();
    };

    logEvent = (event: DomainEvent): void => {
        const data = JSON.stringify(event, null, 4);
        fs.writeFileSync(this.logPathOf(event), data);
    };

    private logPathOf = (event: DomainEvent): string => {
        let index = 0;
        let logPath = this.logPath(event, index);
        while (this.logFileExists(logPath)) {
            index++;
            logPath = this.logPath(event, index);
        }
        return logPath;
    };

    private logFileExists = (logPath: string): boolean => {
        return fs.existsSync(logPath);
    };

    private logPath = (event: DomainEvent, index: number): string => {
        const aggregateDir = `${this.rootPath}/${event.aggregate()}`;
        !fs.existsSync(aggregateDir) && fs.mkdirSync(aggregateDir);

        const aggregateInstanceDir = `${aggregateDir}/${event.aggregateId()}`;
        !fs.existsSync(aggregateInstanceDir) && fs.mkdirSync(aggregateInstanceDir);

        return `${aggregateInstanceDir}/${this.logFileName(event)}${index}.json`
    };

    private logFileName = (event: DomainEvent): string => {
        const generatedOn = event.generatedOn();
        const day = this.doubleDigit(generatedOn.getDate());
        const month = this.doubleDigit(generatedOn.getMonth() + 1);
        const year = generatedOn.getFullYear().toString().substr(-2);
        const hour = this.doubleDigit(generatedOn.getHours());
        const minute = this.doubleDigit(generatedOn.getMinutes());
        const second = this.doubleDigit(generatedOn.getSeconds());
        const milliSecond = this.tripleDigit(generatedOn.getMilliseconds());
        return `${year}${month}${day}${hour}${minute}${second}${milliSecond}`;
    };

    private doubleDigit = (n: number): string => {
        return n<=9 ? '0'+ n.toString() : n.toString();
    };

    private tripleDigit = (n: number): string => {
        return n<=99 ? (n<=9 ? '00'+ n.toString() : '0'+ n.toString()) : n.toString();
    };
}
