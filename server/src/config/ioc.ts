import 'reflect-metadata';
import { Container } from 'inversify'
import * as mongoose from "mongoose";
import { RoomRepository } from '../infrastructure/data-access/repositories/room-repository';
import { TYPES } from './types';
import { IRoomRepository, IUserRepository } from '../domain/interfaces/repository';
import { UserRepository } from '../infrastructure/data-access/repositories/user-repository';
import { Interfaces, TYPE as SOCKET_TYPE } from 'inversify-socket-utils';
import { MessageController } from '../controllers/socket.controller';
import { IRoomManagerService } from '../domain/interfaces/services';
import { RoomManagerService } from '../domain/services/room-manager.service';
export type DbClient = mongoose.Mongoose;

export const registerIocBind = (container: Container) => {

    container.bind<DbClient>(TYPES.Db)
        .toConstantValue(mongoose)

    container.bind<IRoomRepository>(TYPES.RoomRepository)
        .to(RoomRepository)
        .inSingletonScope()

    container.bind<IRoomManagerService>(TYPES.RoomManagerService)
        .to(RoomManagerService)
        .inSingletonScope()

    container.bind<IUserRepository>(TYPES.UserRepository)
        .to(UserRepository)
        .inSingletonScope()

    container.bind<Interfaces.Controller>(SOCKET_TYPE.Controller)
        .to(MessageController)
        .whenTargetNamed('MessageController')
}