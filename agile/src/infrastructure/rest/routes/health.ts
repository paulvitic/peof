import { Router, Request, Response } from 'express';

const route = Router();

export default (app: Router) => {
    app.use('/status', route);

    route.get('',(req: Request, res: Response) => {
        return res
            .status(200)
            .json({ status: "running"})
            .end();
    });

    route.head('',(req: Request, res: Response) => {
        return res
            .status(200)
            .json({ status: "running"})
            .end();
    });
};