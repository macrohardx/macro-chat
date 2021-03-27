import * as chalk from 'chalk';
import { injectable, inject } from 'inversify';
import { Controller, OnConnect, OnDisconnect, OnMessage, Payload, ConnectedSocket } from 'inversify-socket-utils'
import { log } from '../utils/logger';
import { IMessageRepository, IRoomRepository } from '../domain/interfaces/repository';
import { TYPES } from '../config/ioc-types';
import { Message } from 'src/domain/model/models';

var usersVsRooms = {};

/**
 * It's imperative that the client uses the same version of socket.io client served here at the backend
 */
@injectable()
@Controller(
  '/'
)
export class MessageController {

  @inject(TYPES.MessageRepository) private _messageRepository: IMessageRepository;
  @inject(TYPES.RoomRepository) private _roomRepository: IRoomRepository;

  @OnConnect('connection')
  public async connection(@ConnectedSocket() socket: any) {
    const defaultRoom = await this._roomRepository.queryOne({ name: 'general' });
    socket.join(defaultRoom.id);
    usersVsRooms[socket.id] = defaultRoom;
    log(`User ${chalk.blueBright(socket.user.username)} connected at room ${chalk.red(defaultRoom.name)}`);
  }

  @OnDisconnect('disconnect')
  public disconnect(@ConnectedSocket() socket: any) {
    log(`User ${chalk.blueBright(socket.user.username)} disconnected`)
  }

  @OnMessage('message')
  public async message(@Payload() payload: any, @ConnectedSocket() socket: any) {
    log(`Payload ${payload.text} received from user ${chalk.blueBright(socket.user.username)} at room ${chalk.red(usersVsRooms[socket.id].name)}`);
    const message = <Message>{
      text: payload.text,
      userId: socket.user.id,
      roomId: usersVsRooms[socket.id].id,
      username: socket.user.username,
      timestamp: new Date()
    };
    await this._messageRepository.save(message);
    socket.server.to(message.roomId).emit("message", message);
  }

  @OnMessage('join-room')
  public async joinRoom(@Payload() payload: any, @ConnectedSocket() socket: any) {
    const roomLeft = usersVsRooms[socket.id];
    const roomToJoin = await this._roomRepository.findById(payload.roomId);
    usersVsRooms[socket.id] = roomToJoin;
    socket.leave(roomLeft.id);
    socket.join(roomToJoin.id);
    log(`User ${chalk.blueBright(socket.user.username)} left the room ${chalk.red(roomLeft.name)}`);
    log(`User ${chalk.blueBright(socket.user.username)} joined the room ${chalk.red(roomToJoin.name)}`);
  }
}