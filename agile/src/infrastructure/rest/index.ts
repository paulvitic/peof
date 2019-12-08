import { Router } from 'express';
import health from './routes/health';
import {Container} from "../../startup/Container";
import dataCollection from "./routes/dataCollection";

export default (container: Container) => {
	const app = Router();

	health(app);
	dataCollection(app, container);

	return app
}
