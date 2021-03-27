import { Maybe } from '../../utils/maybe';
import { Message, Room } from '../model/models';

export interface IRoomManagerService {
    getAllRooms(): Promise<Room[]>;
    createRoom(room: Room): Promise<Maybe<Room>>;
    deleteRoom(id: string): Promise<void>;
    getUsersRooms(userId: string): Promise<Room[]>;
    addUserToRoom(roomId: string, userId: string): Promise<Maybe<Room>>;
    removeUserFromRoom(roomId: string, userId: string): Promise<Maybe<Room>>;
}