import { Room } from '../model/room';
import { Maybe } from '../../utils/maybe';

export interface IRoomManagerService {
    createRoom(room: Room): Promise<Maybe<Room>>
    deleteRoom(id: string): Promise<void>
    getUsersRooms(userId: string): Promise<Room[]>
    assignUserToRoom(userName: string, roomName: string): Promise<void>
    removeUserFromRoom(userName: string, roomName: string): Promise<void>
}