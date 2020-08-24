import { injectable, inject } from "inversify";
import { Query } from '../../../domain/interfaces/repository';
import { AbstractRepository } from './abstractRepository';
import { TYPES } from '../../../config/types';
import { DbClient } from '../../../config/ioc';
import { Room } from '../../../domain/model/room';
import { Document, Schema, Types } from 'mongoose';

export interface RoomModel extends Room, Document { }

@injectable()
export class RoomRepository extends AbstractRepository<Room, RoomModel> implements RoomRepository {

    public constructor(@inject(TYPES.Db) db: DbClient) {        
        super(db, 'Room', 'rooms')
    }

    protected createSchema() {
        const schema = new Schema({
            name: { type: String, required: true },
            createdAt: { type: Date, required: true },
            updatedAt: { type: Date, required: true },
            owner: { type: Schema.Types.ObjectId, ref: 'User' },
            users: [{ type: Schema.Types.ObjectId, ref: 'User' }]
        })
        schema.pre<RoomModel>('validate', function (next) {
            this.updatedAt = new Date()
            if (!this.createdAt) {
                this.createdAt = new Date(this.updatedAt)
            }
            if (!this.users || !(this.users instanceof Array)) {
                //this.users = new Types.Array<Types.ObjectId>()
            }
            next()
        })
        return schema
    }

    public async queryAllIncludeUser(query: Query<Room>): Promise<Room[]> {
        const rooms = await this.Model.find(query).populate('users')
        return rooms.map((r) => this._readMapper(r))
    }
}

