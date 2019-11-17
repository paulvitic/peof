import { Router } from 'express';
import health from './routes/health';

// guaranteed to get dependencies
export default () => {
	const app = Router();
	health(app);

	return app
}