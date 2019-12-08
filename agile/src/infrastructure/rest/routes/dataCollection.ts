import { Router, Request, Response } from 'express';
import {Container} from "../../../startup/Container";

const route = Router();

export default (app: Router, container: Container) => {
    app.use('/dataCollection', route);

    route.post('',(req: Request, res: Response) => {
        let changesSince: Date = req.body.changesSince;
        if (!changesSince) changesSince = new Date();
        container.dataCollectionService.start(changesSince);
        return res
            .status(200)
            .end();
    });

    route.get('',(req: Request, res: Response) => {
        return res
            .status(200)
            .json(container.dataCollectionMonitor.state())
            .end();
    });
};
