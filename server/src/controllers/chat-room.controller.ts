import { inject } from 'inversify';
import { controller, httpGet, httpPost, httpPut, httpDelete, requestParam, BaseHttpController, requestBody, queryParam } from 'inversify-express-utils';
import { TYPES } from '../config/ioc-types';
import * as HttpStatusCode from 'http-status-codes';
import { Room } from '../domain/model/room';
import { IRoomManagerService } from '../domain/interfaces/services';
import { JsonResult } from 'inversify-express-utils/dts/results';
import { IMessageRepository } from '../domain/interfaces/repository';

@controller(`/macro-chat/api/v1/room`)
export class ChatRoomController extends BaseHttpController {

  constructor(@inject(TYPES.RoomManagerService) private _roomService: IRoomManagerService,
              @inject(TYPES.MessageRepository) private _messageRepository: IMessageRepository) {
    super();
  }

  @httpGet('/all')
  public async getAllRooms(): Promise<JsonResult> {
    return this.json({ data: await this._roomService.getAllRooms() });
  }

  @httpGet('/all/:userId')
  public async getAllUsersRooms(@requestParam('userId') userId: string): Promise<JsonResult> {
    return this.json({ data: await this._roomService.getUsersRooms(userId) });
  }

  @httpPost('/create')
  public async createRoom(@requestBody() room: Room): Promise<JsonResult> {
    const { error, result } = await this._roomService.createRoom(room);
    if (error) {
      return this.json({ error }, HttpStatusCode.CONFLICT);
    }
    return this.json({ data: result }, HttpStatusCode.CREATED);
  }

  @httpDelete('/delete/:roomId')
  public async deleteRoom(@requestParam('roomId') roomId: string): Promise<void> {
    await this._roomService.deleteRoom(roomId);
  }

  @httpPut('/add-user/:roomId/:userId')
  public async addUserToRoom(@requestParam('roomId') roomId: string, @requestParam('userId') userId: string): Promise<JsonResult> {
    const { error, result: updatedRoom } = await this._roomService.addUserToRoom(roomId, userId);
    if (error) {
      return this.json({ error }, HttpStatusCode.NOT_FOUND);
    }
    return this.json({ data: updatedRoom });
  }

  @httpDelete('/remove-user/:roomId/:userId')
  public async removeUserFromRoom(@requestParam('roomId') roomId, @requestParam('userId') userId): Promise<JsonResult> {
    const { error, result: updatedRoom } = await this._roomService.removeUserFromRoom(roomId, userId);
    if (error) {
      return this.json({ error }, HttpStatusCode.NOT_FOUND);
    }
  }

  @httpGet('/:roomId/messages')
  public async getRoomMessages(@requestParam('roomId') roomId: string, @queryParam('n') amount: number, @queryParam('t') timeStamp: Date): Promise<JsonResult> {
    let messages = await this._messageRepository.queryAll({ 
      roomId: roomId,
      timestamp: { $lt: timeStamp }
    }, null, { limit: Math.max(10, amount), sort: { timestamp: 'desc' } });
    messages = messages || [];
    return this.json({ data: messages });
  }
}