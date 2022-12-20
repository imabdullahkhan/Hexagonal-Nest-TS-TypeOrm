export interface IRepository<T> {
  save(entities: any): Promise<void>;

  getCount(filter: any): Promise<number>;

  getAll(filter: any): Promise<T[]>;

  getOne(filter: any): Promise<T>;
}
