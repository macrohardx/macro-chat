import { injectable, inject } from 'inversify';
import { IRoomManagerService } from '../interfaces/services';
import { Room } from '../model/room';
import { TYPES } from '../../config/types';
import { IRoomRepository } from '../interfaces/repository';
import { Maybe } from '../../utils/maybe';


@injectable()
export class RoomManagerService implements IRoomManagerService {

    @inject(TYPES.RoomRepository) private _roomRepository: IRoomRepository

    public async createRoom(room: Room): Promise<Maybe<Room>> {
        const roomExists = (await this._roomRepository.queryAll({ name: room.name })).length > 0
        if (roomExists) {
            return { error: "A room with the same name already exists" }
        }
        return { result: await this._roomRepository.save(room) }
    }

    public async deleteRoom(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    public async getUsersRooms(userId: string): Promise<Room[]> {
        throw new Error("Method not implemented.");
    }

    public async assignUserToRoom(userName: string, roomName: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    public async removeUserFromRoom(userName: string, roomName: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}