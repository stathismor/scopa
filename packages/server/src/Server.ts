import express, { Application, Request, Response, NextFunction } from 'express';
import { createServer as CreateHTTPServer, Server as HTTPServer } from 'http';
import cors from 'cors';
import * as env from './env';

export const createServer = () => {
  const app: Application = express();
  const server: HTTPServer = CreateHTTPServer(app);

  // Allow same origin requests. for local development
  app.use(cors({ origin: env.HOSTS, credentials: true }));

  // Application routing
  app.get('/users', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send({ data: ['user1', 'user2'] });
  });

  return app.listen(env.PORT, () => {
    console.log(`Listening on port ${env.PORT}`);
  });
};
