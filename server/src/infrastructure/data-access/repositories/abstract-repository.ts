import { Document, Model, Schema } from 'mongoose';
import { inject, injectable, unmanaged } from 'inversify';
import { TYPES } from '../../../config/ioc-types';
import { Repository, Query } from '../../../domain/interfaces/repository';
import { DbClient } from '../../../config/ioc';

@injectable()
export abstract class AbstractRepository<TEntity, TModel extends Document> 
    implements Repository<TEntity> {
    
    protected Model: Model<TModel>

    constructor(@inject(TYPES.Db) db: DbClient, @unmanaged() name: string, @unmanaged()collectionName: string) {
        this.Model = db.model<TModel>(name, this.createSchema(), collectionName)
    }

    protected createSchema(): Schema {
        throw 'createSchema not implemented'
    }

    public async findAll(): Promise<TEntity[]> {
        const result = await this.Model.find()
        return result.map((r) => this._readMapper(r))
    }

    public async findById(id: string): Promise<TEntity> {
        const result = await this.Model.findById(id)
        return this._readMapper(result)
    }

    public async findManyById(ids: string[]): Promise<TEntity[]> {
        const result = await this.Model.find({ _id: { $in: ids } } as any)
        return result.map((r) => this._readMapper(r))
    }

    public async queryAll(query?: Query<TEntity>): Promise<TEntity[]> {
        const result = await this.Model.find(query as any)
        return result.map((r) => this._readMapper(r))
    }

    public async queryOne(query?: Query<TEntity>): Promise<TEntity> {
        return this._readMapper(await this.Model.findOne(query as any))
    }

    public async save(entity: TEntity): Promise<TEntity> {
        const model = new this.Model(entity)
        model.isNew = !Boolean(model._id);
        const result = await model.save()
        return this._readMapper(result)
    }

    public async remove(entity: TEntity): Promise<TEntity> {
        const model = new this.Model(entity)
        const result = await model.deleteOne()
        return this._readMapper(result)
    }

    public async removeAll(query?: Query<TEntity>): Promise<void> {
        await this.Model.deleteMany(query as any)
    }

    protected _readMapper(model: TModel): TEntity {
        if (!model) { return null; }
        const obj: any = model.toJSON();
        Object.defineProperty(obj, "_id", Object.getOwnPropertyDescriptor(obj, "_id"));
        Object.defineProperty(obj, "id", Object.getOwnPropertyDescriptor(obj, "_id"));
        return obj as TEntity;
    }
}