import { model, Schema, Document } from 'mongoose'
import { Message, IMessage } from './message';

// interface mostly for typescript autocomplete and intellisense
export interface IRoom extends Document {
    name: string
    createdAt: Date
    updatedAt?: Date
}

const RoomSchema = new Schema({
    name: { type: String, required: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true }
})

RoomSchema.pre<IRoom>('save', function (next) {
    this.updatedAt = new Date()
    next()
})

export const Room = model<IRoom>('Room', RoomSchema, 'rooms')