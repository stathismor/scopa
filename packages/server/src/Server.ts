import express, { Application, Request, Response, NextFunction } from 'express';
import { createServer as CreateHTTPServer, Server as HTTPServer } from 'http';
import cors from 'cors';
import { getRooms } from './controllers/roomController';

export const createServer = () => {
  const app: Application = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  // Allow same origin requests. for local development
  app.use(cors({ origin: process.env.HTTP_ORIGIN }));

  const server: HTTPServer = CreateHTTPServer(app);

  // Application routing
  app.get('/rooms', async (req: Request, res: Response, next: NextFunction) => {
    const rooms = await getRooms();
    res.status(200).send(rooms);
  });

  return app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
  });
};
