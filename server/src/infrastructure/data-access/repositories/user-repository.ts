import { injectable, inject } from "inversify";
import { AbstractRepository } from './abstract-repository';
import { TYPES } from '../../../config/types';
import { DbClient } from '../../../config/ioc';
import { Document, Schema } from 'mongoose';
import { User } from '../../../domain/model/user';
import { IUserRepository } from '../../../domain/interfaces/repository';

export interface UserModel extends User, Document { }

@injectable()
export class UserRepository extends AbstractRepository<User, UserModel> implements IUserRepository {

    public constructor(@inject(TYPES.Db) db: DbClient) {        
        super(db, 'User', 'users')
    }

    protected createSchema() {
        const schema = new Schema({
            username: { type: String, required: true }
        })
        return schema
    }
}