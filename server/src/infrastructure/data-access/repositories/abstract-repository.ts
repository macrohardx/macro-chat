import { Document, Model, Schema } from 'mongoose';
import { inject, injectable, unmanaged } from 'inversify';
import { TYPES } from '../../../config/ioc-types';
import { Repository, Query } from '../../../domain/interfaces/repository';
import { DbClient } from '../../../config/ioc';
import { Entity } from '../../../domain/model/entity';

@injectable()
export abstract class AbstractRepository<TEntity extends Entity, TModel extends Document> 
    implements Repository<TEntity> {
    
    protected Model: Model<TModel>;

    protected hiddenFields: string[] = ['__v'];

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

    public async queryAll(query?: Query<TEntity>, projection?: string | string[] | any, options?: any): Promise<TEntity[]> {
        const result = await this.Model.find(query as any, projection || null, options || null);
        return result.map((r) => this._readMapper(r))
    }

    public async queryOne(query?: Query<TEntity>): Promise<TEntity> {
        return this._readMapper(await this.Model.findOne(query as any))
    }

    public async save(entity: TEntity): Promise<TEntity> {
        const model = new this.Model(entity)
        model.isNew = !Boolean(entity._id);
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
        obj.id = model.id;
        if (this.hiddenFields != null && this.hiddenFields.length > 0) {
            this.hiddenFields.forEach(h => {
                delete obj[h];
            });
        }
        return obj as TEntity;
    }
}