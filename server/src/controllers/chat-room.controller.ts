import { Types } from 'mongoose'
import { inject } from 'inversify'
import { controller, httpGet, httpPost, httpPut, httpDelete, requestParam, BaseHttpController, requestBody } from 'inversify-express-utils'
import { TYPES } from '../config/types'
import * as HttpStatusCode from 'http-status-codes'
import { Room } from '../domain/model/room';
import { IUserRepository, IRoomRepository } from '../domain/interfaces/repository'
import { pull } from 'lodash'
import { IRoomManagerService } from '../domain/interfaces/services';

@controller('/macro-chat/api/v1/room')
export class ChatRoomController extends BaseHttpController {

    @inject(TYPES.RoomRepository) _roomRepository: IRoomRepository
    @inject(TYPES.UserRepository) _userRepository: IUserRepository

    @inject(TYPES.RoomManagerService) _roomService: IRoomManagerService

    @httpGet('/all/:userId')
    private async getAllUsersRooms(@requestParam('userId') userId: Types.ObjectId): Promise<Room[]> {
        return await this._roomRepository.queryAllIncludeUser({ users: userId })
    }

    @httpPost('/create')
    private async createRoom(@requestBody() body) {
        const { error, result } = await this._roomService.createRoom(body as Room)
        if (error) {
            return this.json({error}, HttpStatusCode.CONFLICT)
        }
        return this.json({ data: result }, HttpStatusCode.CREATED)
    }

    @httpDelete('/delete/:roomId')
    private async deleteRoom(@requestParam('roomId') roomId) {
        await this._roomRepository.removeAll({ _id: roomId })
    }

    @httpPut('/add-user/:user-:room')
    private async addUserToRoom(@requestParam('user') username, @requestParam('room') roomName) {
        const room = await this._roomRepository.queryOne({ name: roomName })
        if (!room) {
            return this.json({ error: 'Room not found' }, HttpStatusCode.NOT_FOUND)
        }
        const user = await this._userRepository.queryOne({ username })
        if (!user) {
            return this.json({ error: 'User not found' }, HttpStatusCode.NOT_FOUND)
        }
        if (room.users.indexOf(user._id) !== -1) {
            return this.json({ error: 'User already in the room' }, HttpStatusCode.CONFLICT)
        }
        room.users.push(user._id)
        await this._roomRepository.update(room)
        return this.ok()
    }

    @httpDelete('/remove-user/:user-:room')
    private async removeUserFromRoom(@requestParam('user') username, @requestParam('room') roomName) {
        let room = await this._roomRepository.queryOne({ name: roomName })
        if (!room) {
            return this.json({ error: 'Room not found' }, HttpStatusCode.NOT_FOUND)
        }
        const user = await this._userRepository.queryOne({ username })
        if (!user) {
            return this.json({ error: 'User not found' }, HttpStatusCode.NOT_FOUND)
        }
        pull(room.users, user._id)
        await this._roomRepository.save(room)
        return this.ok()
    }
}