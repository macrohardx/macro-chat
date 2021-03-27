import { Query, Repository } from '../../src/domain/interfaces/repository';
export class StubRepository<T> implements Repository<T> {
  save(entity: T): Promise<T> {
    throw new Error('Method not implemented.');
  }
  remove(entity: T): Promise<T> {
    throw new Error('Method not implemented.');
  }
  removeAll(query?: Query<T>): Promise<void> {
    throw new Error('Method not implemented.');
  }
  findAll(): Promise<T[]> {
    throw new Error('Method not implemented.');
  }
  findById(id: string): Promise<T> {
    throw new Error('Method not implemented.');
  }
  findManyById(ids: string[]): Promise<T[]> {
    throw new Error('Method not implemented.');
  }
  queryAll(query?: Query<T>, projection?: any, options?: any): Promise<T[]> {
    throw new Error('Method not implemented.');
  }
  queryOne(query?: Query<T>): Promise<T> {
    throw new Error('Method not implemented.');
  }

}