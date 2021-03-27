import { injectable, inject } from "inversify";
import { AbstractRepository } from './abstract-repository';
import { TYPES } from '../../../config/ioc-types';
import { DbClient } from '../../../config/ioc';
import { Document, Schema } from 'mongoose';
import { User } from '../../../domain/model/user';
import { IUserRepository } from '../../../domain/interfaces/repository';

export interface UserModel extends User, Document { }

@injectable()
export class UserRepository extends AbstractRepository<User, UserModel> implements IUserRepository {

    public constructor(@inject(TYPES.Db) db: DbClient) {
        super(db, 'User', 'users')
        this.hiddenFields.push('password', 'profilePictureLocation');
    }

    protected createSchema() {
        const schema = new Schema({
            username: { type: String, required: true },
            displayName: { type: String, required: false },
            profilePicPath: { type: String, required: false },
            hostname: { type: String, required: false },
            admin: { type: Boolean, required: false },
            passwordTipQuestion: { type: String, required: false },
            passwordTipAnswer: { type: String, required: false }
        })
        return schema
    }
}