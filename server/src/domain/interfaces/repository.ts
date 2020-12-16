import { Room } from '../model/room';
import { Schema } from 'mongoose';
import { User } from '../model/user';
export type Query<T> = {
    [P in keyof T]?: T[P] | { $regex: RegExp } | any;
}

export interface Repository<TEntity> {
    save(entity: TEntity): Promise<TEntity>
    update(entity: TEntity): Promise<TEntity>
    remove(entity: TEntity): Promise<TEntity>
    removeAll(query?: Query<TEntity>): Promise<void>
    findAll(): Promise<TEntity[]>
    findById(id: string): Promise<TEntity>
    findManyById(ids: string[]): Promise<TEntity[]>
    queryAll(query?: Query<TEntity>): Promise<TEntity[]>
    queryOne(query?: Query<TEntity>): Promise<TEntity>
}

export interface IRoomRepository extends Repository<Room> {
    queryAllIncludeUser(query: Query<Room>): Promise<Room[]>
}
export interface IUserRepository extends Repository<User> {}