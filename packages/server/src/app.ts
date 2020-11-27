import { Server as HTTPServer } from 'http';
import { createSocket } from './Socket';
import { createServer } from './Server';

const server: HTTPServer = createServer();
createSocket(server);
