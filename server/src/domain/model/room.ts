import { Entity } from './entity';

export interface Room extends Entity {
    name: string
    createdAt?: Date
    updatedAt?: Date,
    owner: string,//Types.ObjectId,
    users?: string[]//Types.Array<Types.ObjectId>
}