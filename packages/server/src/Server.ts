import express, { Application, Request, Response, NextFunction } from 'express';
import { createServer as CreateHTTPServer } from 'http';
import cors from 'cors';
import { io } from './app';
import { getRooms, deleteRoom } from './controllers/roomController';
import { emitRoomUpdate } from './emitters/roomEmitter';

export const createServer = () => {
  const app: Application = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  // Allow same origin requests. for local development
  app.use(cors({ origin: process.env.HTTP_ORIGIN }));

  CreateHTTPServer(app);

  // Application routing
  app.get('/rooms', async (_req: Request, res: Response, _next: NextFunction) => {
    const rooms = await getRooms();
    res.status(200).send(rooms);
  });

  app.delete('/rooms/:roomName', async (req: Request, res: Response, _next: NextFunction) => {
    const { roomName } = req.params;
    const { username } = req.body;

    try {
      await deleteRoom(roomName, username);
      res.status(200).send({});
    } catch (e) {
      console.error(e.name + ': ' + e.message);
      res.status(400).send(e);
    }
    await emitRoomUpdate(io);
  });

  return app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
  });
};
