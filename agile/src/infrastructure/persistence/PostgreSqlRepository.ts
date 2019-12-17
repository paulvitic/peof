import {Client} from 'pg'

export default class PostgreSqlRepository {
    connect = async () => {
        const client = new Client();
        client.connect()
            .then(() => {
                client.query('SELECT NOW()')
                    .then(async (res) => {
                        global.log.info(res.rows[0]["now"]);
                        await client.end()
                    })
                    .catch((err) => {
                        global.log.warn(`Error while querying ${err}`);
                    })
            })
            .catch((err) => {
                global.log.warn(`Error while connecting ${err}`);
            });
    }
}
