
import { Schema, model, Document } from 'mongoose'

const messageSchema = new Schema({
    text: { type: String, required: true },
    username: { type: String, required: true },
    sentAt: { type: Date, required: true },
    referenceMessage: { type: String, required: false },
    room: { type: String, required: true }
})

interface IMessage extends Document {
    text: string
    username: string,
    sentAt: Date,
    referenceMessage: string
    room: string
}

export const Message = model<IMessage>('Message', messageSchema, 'messages')
