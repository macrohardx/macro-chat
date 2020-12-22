import { inject } from 'inversify';
import { controller, httpGet, httpPost, httpPut, httpDelete, requestParam, BaseHttpController, requestBody } from 'inversify-express-utils';
import { TYPES } from '../config/ioc-types';
import * as HttpStatusCode from 'http-status-codes';
import { Room } from '../domain/model/room';
import { IRoomManagerService } from '../domain/interfaces/services';
import { JsonResult } from 'inversify-express-utils/dts/results';

@controller(`/macro-chat/api/v1/room`)
export class ChatRoomController extends BaseHttpController {

  @inject(TYPES.RoomManagerService) _roomService: IRoomManagerService;

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
}