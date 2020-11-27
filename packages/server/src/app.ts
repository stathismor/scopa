import { Server as HTTPServer } from 'http';
import { createSocket } from './Socket';
import { createServer } from './Server';
import * as dotenv from 'dotenv';

dotenv.config();

const server: HTTPServer = createServer();
createSocket(server);
