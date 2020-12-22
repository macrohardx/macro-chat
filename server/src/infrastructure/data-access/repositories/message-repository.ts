import { injectable, inject } from "inversify";
import { IMessageRepository } from '../../../domain/interfaces/repository';
import { AbstractRepository } from './abstract-repository';
import { TYPES } from '../../../config/ioc-types';
import { DbClient } from '../../../config/ioc';
import { Document, Schema } from 'mongoose';
import { Message } from '../../../domain/model/models';

export interface MessageModel extends Message, Document { }

@injectable()
export class MessageRepository extends AbstractRepository<Message, MessageModel> implements IMessageRepository {

  public constructor(@inject(TYPES.Db) db: DbClient) {
    super(db, 'Message', 'messages')
  }

  protected createSchema() {
    const schema = new Schema({
      text: { type: String, required: true },
      timestamp: { type: Date, required: true },
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
      username: { type: String, required: true },
      roomId: { ttype: Schema.Types.ObjectId, ref: 'Room' },
      reference: { type: Schema.Types.ObjectId, ref: 'Message' }
    })
    schema.pre<MessageModel>('validate', function (next) {
      this.timestamp = this.timestamp || new Date();
      if (!this.userId || !this.roomId) {
        return next(new Error('Invalid message.'));
      }
      next();
    })
    return schema
  }
}

