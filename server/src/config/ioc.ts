import { Container } from 'inversify'
import * as mongoose from "mongoose";
import { RoomRepository } from '../infrastructure/data-access/repositories/room-repository';
import { TYPES } from './types';
export type DbClient = mongoose.Mongoose;

export const registerIocBind = (container: Container) => {

    container.bind<DbClient>(TYPES.Db)
        .toConstantValue(mongoose)

    container.bind<RoomRepository>(TYPES.RoomRepository)
        .to(RoomRepository)
        .inSingletonScope()
}