import { Entity } from './entity';

export interface Message extends Entity {
    text: string,
    userId: string,
    username: string,
    timestamp: Date,
    reference?: string
    roomId: string
}