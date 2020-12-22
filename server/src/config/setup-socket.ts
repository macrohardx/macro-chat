import { tokenValidationMiddleware } from '../domain/middleware/chat-socket.middleware';
import { Server } from 'http';
import { Server as IoServer } from 'socket.io'
import { InversifySocketServer } from 'inversify-socket-utils';
import { Container } from 'inversify';

export function setupSocket(httpServer: Server, iocContainer: Container) {
  const ioServer = new IoServer(httpServer, {
    path: '/macro-chat/socket-connection'
  });
  ioServer.use(tokenValidationMiddleware);
  const socketServer = new InversifySocketServer(iocContainer, ioServer);
  return socketServer.build()
}