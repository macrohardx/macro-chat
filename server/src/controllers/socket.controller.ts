import * as chalk from 'chalk';
import { injectable } from "inversify";
import { Controller, OnConnect, OnDisconnect, OnMessage, Payload, ConnectedSocket } from 'inversify-socket-utils'
import { log } from '../utils/logger';

var usersVsRooms = {};

@injectable()
@Controller(
  '/'
)
export class MessageController {

  @OnConnect('connection')
  connection(@ConnectedSocket() socket: any) {
    socket.join('general');
    usersVsRooms[socket.id] = 'general';
    log(`User ${chalk.blueBright(socket.id)} connected at room ${chalk.red(usersVsRooms[socket.id])} 0 ${socket.username}`);
  }

  @OnDisconnect('disconnect')
  disconnect(@ConnectedSocket() socket: any) {
    log(`User ${chalk.blueBright(socket.id)} disconnected`)
  }

  @OnMessage('message')
  message(@Payload() payload: any, @ConnectedSocket() socket: any) {
    log(`Payload ${payload} received from user ${chalk.blueBright(socket.id)} at room ${chalk.red(usersVsRooms[socket.id])}`);
    socket.server.to(usersVsRooms[socket.id]).emit("message", payload);
  }

  @OnMessage('join-room')
  joinRoom(@Payload() payload: any, @ConnectedSocket() socket: any) {
    let roomLeft = usersVsRooms[socket.id];
    usersVsRooms[socket.id] = payload.roomId;
    socket.leave(roomLeft);    
    socket.join(payload.roomId);
    log(`User ${chalk.blueBright(socket.id)} left the room ${chalk.red(roomLeft)}`);
    log(`User ${chalk.blueBright(socket.id)} joined the room ${chalk.red(payload.roomId)}`);
  }
}