import { injectable } from "inversify";
import { IRoom } from '../model/room';

export interface IChatRoomService {
    getUserRooms(userId: string) : Promise<IRoom[]>
}

@injectable()
export class ChatRoomService implements IChatRoomService {    
    public async getUserRooms(userId: string) : Promise<IRoom[]>{
        return Promise.resolve(null)
    }
}