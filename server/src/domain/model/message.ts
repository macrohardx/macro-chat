import { Entity } from './entity';

export interface Message extends Entity {
    text: string,
    userId: string,
    username: string,
    timestamp: Date,
    reference: string
    roomId: string
}

// import { Schema, model, Document } from 'mongoose'

// const MessageSchema = new Schema({
//     _id: Schema.Types.ObjectId,
//     text: { type: String, required: true },
//     username: { type: String, required: true },
//     sentAt: { type: Date, required: true },
//     replyMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
//     room: { type: Schema.Types.ObjectId, ref: 'Room' }
// })

// MessageSchema.pre<IMessage>('validate', function (next) {
//     if (!this.sentAt) {
//         this.sentAt = new Date()
//     }
//     next()
// })

// // interface mostly for typescript autocomplete and intellisense
// export interface IMessage extends Document {
//     text: string
//     username: string
//     room: any
//     sentAt?: Date
//     replyMessage?: any
// }

// export const Message = model<IMessage>('Message', MessageSchema, 'messages')
