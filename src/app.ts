import { Server as HTTPServer } from 'http';
import { createSocket } from './Socket';
import { createServer } from './Server';

const PORT = 3000;

const server: HTTPServer = createServer(PORT);
createSocket(server);
