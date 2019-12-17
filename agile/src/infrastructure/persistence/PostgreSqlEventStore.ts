import {Pool} from "pg";
import EventStore from "../../domain/EventStore";
import DomainEvent from "../../domain/DomainEvent";

export default class PostgreSqlEventStore implements EventStore {
    private readonly pool : Pool;

    constructor() {
        this.pool = new Pool();
        this.pool.on('error', (err, client) => {
            console.error('Unexpected error on idle client', err);
            process.exit(-1)
        })
    }

    eventsOfAggregate = async (aggregate: string, aggregateId: string): Promise<DomainEvent[]> => {
        const client = await this.pool.connect();
        try {
            const res = await client.query('SELECT * FROM users WHERE id = $1', [1]);
            console.log(res.rows[0]);
            return new Promise((resolve, reject) => {resolve([]);})
        } catch (e) {
            return new Promise((resolve, reject) => {reject(e);})
        } finally {
            client.release()
        }

    };

    eventsOfAggregateSince = async (aggregate: string, aggregateId: string, since: Date): Promise<DomainEvent[]> => {
        return new Promise((resolve, reject) => {
            reject(new Error("Nor yet implemented"));
        })
    };

    logEvent = async (event: DomainEvent): Promise<void> => {
        const client = await this.pool.connect();
        try {
            const res = await client.query('SELECT * FROM users WHERE id = $1', [1]);
            console.log(res.rows[0])
        } catch (e) {
            return new Promise((resolve, reject) => {reject(e);})
        } finally {
            client.release()
        }
    }
}
