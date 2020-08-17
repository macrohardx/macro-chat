import { model, Schema, Document } from 'mongoose'

// interface mostly for typescript autocomplete and intellisense
export interface IUser extends Document {
    username: string
}

const UserSchema = new Schema({
    username: { type: String, required: true }
})

export const User = model<IUser>('User', UserSchema, 'users')