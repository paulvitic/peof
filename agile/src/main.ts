import {Startup} from './startup'

Startup.start()
    .then((appConfig) => {
        global.log.info(`Application started with config:\n${JSON.stringify(appConfig, null, 2)}`);
    })
    .catch((error) => {
        global.log.error(`Error occurred while starting the app!\n${error}`);
        // As the application failed to start, terminate the the process
        process.exit();
    });
