import { Room } from '../model/room';
import { Schema } from 'mongoose';
export type Query<T> = {
    [P in keyof T]?: T[P] | { $regex: RegExp } | any;
}

export interface Repository<TEntity> {
    save(entity: TEntity): Promise<TEntity>
    remove(entity: TEntity): Promise<TEntity>
    removeAll(query?: Query<TEntity>): Promise<void>
    findAll(): Promise<TEntity[]>
    findById(id: string): Promise<TEntity>
    findManyById(ids: string[]): Promise<TEntity[]>
    queryAll(query?: Query<TEntity>): Promise<TEntity[]>
}

export interface RoomRepository extends Repository<Room> {
    queryAllIncludeUser(query: Query<Room>): Promise<Room[]>
}
