class Service {
    static async start() {
        console.log('Hello TypeScript!');
    }
}

Service.start()
    .then((appConfig) => {
        console.log('finsihes');
    })
    .catch((error) => {
        console.log('error');

        // As the application failed to start, terminate the process
        process.exit();
    });