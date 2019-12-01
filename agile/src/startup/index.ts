import startExpress from './express';
import { getEnvironment } from "./environment"
import logger from "./logger";
import {Container} from "./Container";

export class Startup {

  static async start() {
    const config = await getEnvironment();

    await logger(config);
    global.log.info('Logger initialized');

    const container = await Container.build(config);

    await startExpress(container, config);
    global.log.info('Express loaded');

    return config;
  }
}







