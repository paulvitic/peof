import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import routes from '../infrastructure/rest';
import {Container} from "./Container";
import {Environment} from "./environment";

interface HttpError extends Error {
  status: number;
}

export default (container: Container, config: Environment) => {
  const app = express();

  // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  // It shows the real origin IP in the heroku or Cloudwatch logs
  app.enable('trust proxy');

  // Middleware that transforms the raw string of req.body into json
  app.use(bodyParser.json());

  // Load API routes
  app.use(config.API_PREFIX, routes());

  /// catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error('Not Found') as HttpError;
    err['status'] = 404;
    next(err);
  });

  /// error handlers
  app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    /**
     * Handle 401 thrown by express-jwt library
     */
    if (err.name === 'UnauthorizedError') {
      return res
        .status(err.status)
        .send({ message: err.message })
        .end();
    }
    return next(err);
  });

  app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
      },
    });
  });
};
