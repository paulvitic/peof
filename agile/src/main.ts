import config from './startup/config';
import loaders from './startup/loaders'
import express from 'express';

async function startServer() {
    const expressApp = express();
    await loaders(expressApp);

    expressApp.listen(config.port, err => {
        if (err) {
            global.log.error(err);
            process.exit(1);
            return;
        }
        global.log.info(`
      ################################################
      🛡️  Server listening on port: ${config.port} 🛡️ 
      ################################################
    `);
    });
}

startServer();
