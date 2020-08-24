import { Types } from 'mongoose'

export interface Room {
    _id: any
    name: string
    createdAt?: Date
    updatedAt?: Date,
    owner: string,//Types.ObjectId,
    users?: string[]//Types.Array<Types.ObjectId>
}