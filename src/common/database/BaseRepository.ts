import { IRepository } from 'src/common/database/IRepository';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';

class BaseRepository<T> implements IRepository<T> {
  protected repo: Repository<T>;

  protected alias: string;

  constructor(model: Repository<T>) {
    this.repo = model;
  }

  protected qb(): SelectQueryBuilder<T> {
    return this.repo.createQueryBuilder(this.alias);
  }

  async save(entities: any) {
    this.repo.save(entities);
  }

  async getCount(filter: any): Promise<number> {
    return await this.repo.count(filter);
  }

  async getAll(filter: any): Promise<T[]> {
    return await this.repo.find({
      ...filter,
    });
  }

  async getOne(filter: any): Promise<T> {
    const data = await this.repo.findOne(filter);

    return data ?? null;
  }

  async insert(data: any) {
    const savedData = await this.repo.insert(data);
    return savedData || null;
  }

  async update(filter: any, data: any) {
    return await this.repo.update(filter, data);
  }

  protected _applySearchFilter = (
    querable: SelectQueryBuilder<T>,
    query: string,
    cols: string[]
  ): SelectQueryBuilder<T> => {
    return querable.andWhere(
      new Brackets((qb) => {
        cols.forEach((col, idx) => {
          if (idx == 0)
            qb = qb.where(
              `LOWER(${this.alias}.${col}) LIKE LOWER('${query}%')`
            );
          else
            qb.orWhere(`LOWER(${this.alias}.${col}) LIKE LOWER('${query}%')`);
        });
      })
    );
  };

  protected _applyPagination(
    querable: SelectQueryBuilder<T>,
    paginationParams: any
  ): SelectQueryBuilder<T> {
    const { take, page } = paginationParams;

    const skip = (page - 1) * take;

    return querable.skip(skip).take(take);
  }
}

export default BaseRepository;
