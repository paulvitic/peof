import winston from 'winston';
import {Environment} from "./environment";

export default (config: Environment) => {
    const transports = [];
    if(process.env.NODE_ENV !== 'development') {
        transports.push(
            new winston.transports.Console()
        )
    } else {
        transports.push(
            new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.cli(),
                    winston.format.splat(),
                )
            })
        )
    }
    const Logger = winston.createLogger({
        level: config.LOG_LEVEL,
        levels: winston.config.npm.levels,
        format: winston.format.combine(
            winston.format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss'
            }),
            winston.format.errors({ stack: true }),
            winston.format.splat(),
            winston.format.json()
        ),
        transports
    });

    global.log = {
        info: (message:string) => { Logger.info(message) },
        error: (message:string) => { Logger.error(message) },
        warn: (message:string) => { Logger.warn(message) },
        debug: (message:string) => { Logger.debug(message) }
    };
}
