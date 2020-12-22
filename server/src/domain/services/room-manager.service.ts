import { injectable, inject } from 'inversify';
import { IRoomManagerService } from '../interfaces/services';
import { Room } from '../model/room';
import { TYPES } from '../../config/ioc-types';
import { IRoomRepository, IUserRepository } from '../interfaces/repository';
import { Maybe } from '../../utils/maybe';
import { pull } from 'lodash';

@injectable()
export class RoomManagerService implements IRoomManagerService {

    @inject(TYPES.RoomRepository) private _roomRepository: IRoomRepository;
    @inject(TYPES.UserRepository) private _usersRepository: IUserRepository;

    public async createRoom(room: Room): Promise<Maybe<Room>> {
        const roomExists = !!(await this._roomRepository.queryOne({ name: room.name }));
        if (roomExists) {
            return { error: "A room with the same name already exists" };
        }
        return { result: await this._roomRepository.save(room) };
    }

    public async getAllRooms(): Promise<Room[]> {
        return await this._roomRepository.queryAll();
    }

    public async deleteRoom(id: string): Promise<void> {
        return await this._roomRepository.removeAll({ _id: id });
    }

    public async getUsersRooms(userId: string): Promise<Room[]> {
        return await this._roomRepository.queryAllIncludeUser({ users: userId });
    }

    public async addUserToRoom(roomId: string, userId: string): Promise<Maybe<Room>> {
        const room = await this._roomRepository.findById(roomId);
        if (!room) {
            return { error: 'Room not found' };
        }
        const user = await this._usersRepository.findById(userId);
        if (!user) {
            return { error: 'User not found' };
        }
        if (room.users.indexOf(user.id) !== -1) {
            return { error: 'User already in the room' };
        }
        room.users.push(user.id);
        return { result: await this._roomRepository.save(room) };
    }

    public async removeUserFromRoom(roomId: string, userId: string): Promise<Maybe<Room>> {
        let room = await this._roomRepository.findById(roomId);
        if (!room) {
            return { error: 'Room not found' };
        }
        const user = await this._usersRepository.findById(userId);
        if (!user) {
            return { error: 'User not found' };
        }
        pull(room.users, user.id);
        return { result: await this._roomRepository.save(room) };
    }
}