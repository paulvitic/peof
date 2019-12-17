import {config} from "dotenv";
import PostgreSqlRepository from "../../../src/infrastructure/persistence/PostgreSqlRepository";


test('should connect to db', () => {
    const envFound = config();
    let postgreSqlRepository = new PostgreSqlRepository();
    postgreSqlRepository.connect()
});
