import { model, Schema, Document, Types } from 'mongoose'

// interface mostly for typescript autocomplete and intellisense
export interface IRoom extends Document {
    name: string
    createdAt?: Date
    updatedAt?: Date,
    owner: Types.ObjectId,
    users?: Types.Array<Types.ObjectId>
}

const RoomSchema = new Schema({
    name: { type: String, required: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }]
})

//User.find().populate('users').exec()

RoomSchema.pre<IRoom>('validate', function (next) {
    this.updatedAt = new Date()
    if (!this.createdAt) {
        this.createdAt = new Date(this.updatedAt)
    }
    if (!this.users || !(this.users instanceof Array)) {
        this.users = new Types.Array<Types.ObjectId>()
    }
    next()
})

export const Room = model<IRoom>('Room', RoomSchema, 'rooms')