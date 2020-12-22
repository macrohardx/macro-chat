import { Room } from '../model/room';
import { Maybe } from '../../utils/maybe';

export interface IRoomManagerService {
    getAllRooms(): Promise<Room[]>;
    createRoom(room: Room): Promise<Maybe<Room>>;
    deleteRoom(id: string): Promise<void>;
    getUsersRooms(userId: string): Promise<Room[]>;
    addUserToRoom(roomId: string, userId: string): Promise<Maybe<Room>>;
    removeUserFromRoom(roomId: string, userId: string): Promise<Maybe<Room>>;
}