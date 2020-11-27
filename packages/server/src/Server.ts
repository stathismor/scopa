import express, { Application, Request, Response, NextFunction } from 'express';
import { createServer as CreateHTTPServer, Server as HTTPServer } from 'http';
import cors from 'cors';

export const createServer = () => {
  const app: Application = express();
  const server: HTTPServer = CreateHTTPServer(app);

  // Allow same origin requests. for local development
  app.use(cors({ origin: process.env.HTTP_ORIGIN }));

  // Application routing
  app.get('/users', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send({ data: ['user1', 'user2'] });
  });

  return app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
  });
};
