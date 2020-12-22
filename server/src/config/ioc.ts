import 'reflect-metadata';
import { Container } from 'inversify'
import * as mongoose from "mongoose";
import { TYPES } from './ioc-types';
import { IMessageRepository, IRoomRepository, IUserRepository } from '../domain/interfaces/repository';
import { Interfaces, TYPE as SOCKET_TYPE } from 'inversify-socket-utils';
import { MessageController } from '../controllers/socket.controller';
import { IRoomManagerService } from '../domain/interfaces/services';
import { RoomManagerService } from '../domain/services/room-manager.service';
import { RoomRepository, UserRepository, MessageRepository} from '../infrastructure/data-access/repositories/repositories';
export type DbClient = mongoose.Mongoose;

export const registerIoc = () => {

    const container = new Container();

    container.bind<DbClient>(TYPES.Db)
        .toConstantValue(mongoose);

    // Respositories
    container.bind<IRoomRepository>(TYPES.RoomRepository)
        .to(RoomRepository)
        .inSingletonScope();    

    container.bind<IUserRepository>(TYPES.UserRepository)
        .to(UserRepository)
        .inSingletonScope();

    container.bind<IMessageRepository>(TYPES.MessageRepository)
        .to(MessageRepository)
        .inSingletonScope();

    // Services:
    container.bind<IRoomManagerService>(TYPES.RoomManagerService)
        .to(RoomManagerService)
        .inSingletonScope();

    // Socket controllers:
    container.bind<Interfaces.Controller>(SOCKET_TYPE.Controller)
        .to(MessageController)
        .whenTargetNamed('MessageController');

    return container;
}