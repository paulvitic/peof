import cron from "node-cron";
import DataCollectionService from "../../application/DataCollectionService";

export default class JobScheduler {

    constructor(private readonly cronExpression: string,
                private readonly service: DataCollectionService) {
        this.schedule();
    }

    private schedule(){
        cron.schedule(this.cronExpression, this.executeJob());
    }

    private executeJob() {
        return () => {
            global.log.info("Running a task");
            this.service.start();
        }
    }
}
