import express, { Application, Request, Response, NextFunction } from 'express';
import { createServer as CreateHTTPServer, Server as HTTPServer } from 'http';

export const createServer = (port: number) => {
  const app: Application = express();
  const server: HTTPServer = CreateHTTPServer(app);

  // Application routing
  app.get('/', (req: Request, res: Response, next: NextFunction) => {
    console.log('Hello Daniele');
    res.status(200).send({ data: 'Hello Daniele' });
  });

  return app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
};
