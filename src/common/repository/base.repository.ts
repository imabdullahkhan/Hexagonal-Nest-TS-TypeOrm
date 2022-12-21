import { DeepPartial, In, IsNull, LessThan, MoreThan, ObjectType, Repository, UpdateResult } from 'typeorm';
import { BaseModel } from '../model/base.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Logger } from '@nestjs/common';
import { AllowDateFormat, ConvertToSpecificFormat, Now } from '../helper/date.helper';
export interface PaginationDBParams {
  Limit: number;
  Offset: number | string; // Offset as string would be Id for mongo before/after pagination
}

export abstract class BaseRepository<T> extends Repository<T> {
  protected Model: ObjectType<T>;

  protected ConnectionName: string;

  protected DefaultOrderByColumn = 'createdAt';

  protected DefaultOrderByDirection = 'ASC';

  protected PrimaryColumnKey = 'id';

  protected constructor(model, connectionName, manager) {
    super(model, manager);
    this.Model = model;
    this.ConnectionName = connectionName;
  }

  protected SetRepo(): void { }

  /**
   *  Returns new instance
   * @param {T} instance
   * @returns {Promise<T extends BaseModel>}
   */
  public async Create(instance: T): Promise<T> {
    return this.Save(instance);
  }

  public async Reload(instance: T): Promise<T> {
    return this.findOne(this.getId(instance));
  }

  public async FindOne(whereParams): Promise<T> {
    const records: Array<T> = await this.Find(whereParams, {
      Limit: 1,
      Offset: 0,
    });
    return records[0] ? records[0] : null;
  }

  public async Find(whereParams, options?: PaginationDBParams): Promise<T[]> {
    let params = {
      where: this.PrepareParams(whereParams),
    };
    params = this.ApplyProjection(params);
    params = this.ApplyPagination(params, options);
    params = this.ApplyOrder(params);
    console.log(params, "PARAMS")
    return this.find(params);
  }

  public async Count(whereParams): Promise<number> {
    const params = {
      where: this.PrepareParams(whereParams),
    };
    return this.count(params);
  }

  public async FindAll(options?: PaginationDBParams): Promise<T[]> {
    return this.Find({}, options);
  }

  protected PrepareParams(whereParams, options?: PaginationDBParams) {
    const whereClauses = {} as any;
    for (const key in whereParams) {
      let val = whereParams[key];

      if (key[0] === '$') {
        // do nothing
      } else if (Array.isArray(val)) {
        val = this.InOperator(val);
      } else if (val === null) {
        val = IsNull();
      }

      whereClauses[key] = val;
    }
    whereClauses.deletedAt = null;

    // TODO: best approach to do this
    if (options && typeof options.Offset === 'string' && !whereClauses[this.GetPrimaryColumnKey()]) {
      let func = null;
      if (options.Offset[0] == '-') {
        func = this.LessThanOperator;
      } else if (options.Offset[0] == '+') {
        func = this.MoreThanOperator;
      }
      if (func) {
        whereClauses[this.GetPrimaryColumnKey()] = func(this.GetPrimaryColumnValue(options.Offset.substr(1)));
      }
    }
    return whereClauses;
  }

  //todo error there
  public async Save(instance: T): Promise<T> {
    return (await this.save(instance as DeepPartial<T>)) as T;
  }

  public async Delete(param: any): Promise<UpdateResult> {
    param = this.PrepareParams(param);
    return this.update(param, {
      DeletedAt: ConvertToSpecificFormat(Now(), AllowDateFormat.DateTime),
    } as any);
  }

  public async DeleteById(id: number): Promise<UpdateResult> {
    return this.Delete({
      Id: id,
    });
  }

  public async BatchCreate(data: Array<Partial<T>>) {
    data = data.map((obj) => {
      return obj;
    });
    return this.createQueryBuilder()
      .insert()
      .into(this.Model)
      .values(data as any as QueryDeepPartialEntity<T>[])
      .execute();
  }

  public async FindById(id: number): Promise<T> {
    const Param: any = {};
    Param[this.GetPrimaryColumnKey()] = this.GetPrimaryColumnValue(id);
    return this.FindOne(Param);
  }

  public async FindAndMap(whereParams, options: PaginationDBParams, callback: (instance: T) => any) {
    const generator = this.FindGen(whereParams, options);

    const results = [];
    for await (const object of generator) {
      let result = callback(object);
      if (result instanceof Promise) {
        result = await result;
      }
      results.push(result);
    }
    return results;
  }

  public async *FindGen(whereParams, options: PaginationDBParams): AsyncIterableIterator<T> {
    if (options.Limit === -1) {
      Logger.warn('this function is not intended to use with limit -1');
    }

    if (options.Offset !== undefined && options.Offset !== 0) {
      Logger.warn('some results might not fetch when offset is not zero or undefined');
    }

    const Limit = options.Limit || 10;
    let Offset = (options.Offset as number) || 0;

    let Objects = [];
    do {
      Objects = await this.Find(whereParams, {
        Limit,
        Offset,
      });
      Offset += Objects.length;

      for (const obj of Objects) {
        yield obj;
      }
    } while (Objects.length >= Limit);
  }

  public async Update(selection, update) {
    const params = this.PrepareParams(selection);
    // update.UpdatedAt = Date.now();
    await this.update(params, update);
  }

  protected ApplyPagination(whereParams: any, options?: PaginationDBParams): any {
    let Limit = 10;
    let Offset = 0;

    if (options) {
      if (typeof options.Offset == 'number') {
        Offset = options.Offset;
      }
      if (options.Limit) {
        Limit = options.Limit;
      }
    }
    if (Limit != -1 && options !== undefined) {
      whereParams.take = Limit;
      whereParams.skip = Offset;
    }
    return whereParams;
  }

  // TODO: discuss this methods cases
  // protected SetTimestamps(obj: T): T {
  //   if (obj.createdAt === undefined) {
  //     obj.createdAt = Date.now();
  //   }
  //   obj.updatedAt = obj.updatedAt === undefined ? obj.createdAt : Date.now();

  //   if (obj.deletedAt === undefined) {
  //     obj.deletedAt = null;
  //   }
  //   return obj;
  // }

  protected GetPrimaryColumnValue(val) {
    return val;
  }

  protected GetPrimaryColumnKey() {
    return this.PrimaryColumnKey;
  }

  protected ApplyOrder(whereParams: any, orderOptions?: { Column: string; Direction: 'ASC' | 'DESC' }): any {
    let Column: string = this.DefaultOrderByColumn;
    let Direction: string = this.DefaultOrderByDirection;

    if (orderOptions !== undefined) {
      if (orderOptions.Column) {
        Column = orderOptions.Column;
      }

      if (orderOptions.Direction) {
        Direction = orderOptions.Direction;
      }
    }

    if (whereParams.order === undefined) {
      whereParams.order = {};
    }

    whereParams.order[Column] = Direction;

    return whereParams;
  }

  protected ApplyProjection(whereParams: any) {
    return whereParams;
  }

  protected LessThanOperator(val: any): any {
    return LessThan(val);
  }

  protected MoreThanOperator(val): any {
    return MoreThan(val);
  }

  protected InOperator(val): any {
    return In(val);
  }
}
