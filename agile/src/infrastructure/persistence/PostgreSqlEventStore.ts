import {Pool} from "pg";
import EventStore from "../../domain/EventStore";
import DomainEvent, {EventRegistry} from "../../domain/DomainEvent";

export default class PostgreSqlEventStore implements EventStore {
    private readonly pool: Pool;

    constructor() {
        this.pool = new Pool();
        this.pool.on('error', (err, client) => {
            console.error('Unexpected error on idle client', err);
            process.exit(-1)
        })
    }

    eventsOfAggregate = async (aggregate: string, aggregateId: string): Promise<DomainEvent[]> => {
        const query = {
            text: 'SELECT event FROM jira.event_log WHERE aggregate=$1 AND aggregate_id=$2 ORDER BY generated_on',
            values: [aggregate, aggregateId],
        };

        let error:Error;
        const events = new Array<DomainEvent>();
        try {
            let result = await this.pool.query(query);
            for (let row of result.rows){
                let event = EventRegistry.fromJsonObject(row.event);
                if (event) events.push(event);
            }
        } catch (e) {
            error = e
        }

        return new Promise((resolve, reject) => {
            if (error) reject(error);
            else resolve(events);
        })
    };

    eventsOfAggregateSince = async (aggregate: string, aggregateId: string, since: Date): Promise<DomainEvent[]> => {
        return new Promise((resolve, reject) => {
            reject(new Error("Not yet implemented"));
        })
    };

    logEvent = async (event: DomainEvent): Promise<void> => {
        const query = {
            text: 'INSERT INTO jira.event_log(aggregate_id, aggregate, event_type, generated_on, event) VALUES($1, $2, $3, $4, $5) RETURNING event_type',
            values: [event.aggregateId(), event.aggregate(), event.eventType(), event.generatedOn(), JSON.stringify(event)],
        };

        let error:Error;
        try {
            let result = await this.pool.query(query);
            global.log.info(`Logged ${result.rows[0].event_type}`)
        } catch (e) {
            error = e
        }

        return new Promise((resolve, reject) => {
            if (error) reject(error);
            else resolve();
        })
    }
}
