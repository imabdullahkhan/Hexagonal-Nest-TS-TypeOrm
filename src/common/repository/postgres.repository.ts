import { BaseRepository, PaginationDBParams } from './base.repository';
import { DataSource, SelectQueryBuilder } from 'typeorm';
import { Injectable } from '@nestjs/common';


export abstract class PostgresRepository<T> extends BaseRepository<T> {
  protected abstract DefaultAlias: string;

  // constructor(model, dataSource: DataSource) {
  //   super(model, 'postgres', dataSource.manager);
  //   this.SetRepo();
  // }
  protected constructor(model, dataSource: DataSource) {
    // super(model, 'postgres');
    super(model, 'postgres', dataSource.manager);
  }

  public async Create(instance: T): Promise<T> {
    return this.Reload(await this.Save(instance));
  }

  protected ApplyConditionOnQueryBuilder(query: SelectQueryBuilder<T>, params): SelectQueryBuilder<T> {
    if (params.DeletedAt === undefined && !params.WithDeleted) {
      params.DeletedAt = null;
    }
    delete params.WithDeleted;

    for (const key in params) {
      const Val = params[key];
      let Str = '';
      if (Array.isArray(Val)) {
        Str = this.ToDBCase(key) + ' IN (:...' + key + ')';
      } else if (Val === null) {
        Str = this.ToDBCase(key) + ' IS NULL';
      } else if (Val === undefined) {
        continue;
      } else {
        Str = this.ToDBCase(key) + ' = :' + key;
      }
      const param = {};
      param[key] = Val;
      query = query.andWhere(this.DefaultAlias + '.' + Str, param);
    }
    return query;
  }

  protected ToDBCase(str: string) {
    return typeof str === 'string'
      ? str
        .replace(/(?:^|\.?)([A-Z])/g, function (x, y) {
          return '_' + y.toLowerCase();
        })
        .replace(/^_/, '')
      : str;
  }

  protected ApplyOrderOnQueryBuilder(
    query: SelectQueryBuilder<T>,
    orderOptions?: { Column: string; Direction: 'ASC' | 'DESC' },
  ): SelectQueryBuilder<T> {
    const order: any = super.ApplyOrder({}, orderOptions).order;
    const preparedOrder = {};
    for (const key in order) {
      preparedOrder[this.DefaultAlias + '.' + key] = order[key];
    }
    return query.orderBy(preparedOrder);
  }

  protected ApplyPaginationOnQueryBuilder(
    query: SelectQueryBuilder<T>,
    options?: PaginationDBParams,
  ): SelectQueryBuilder<T> {
    const paginationParams = super.ApplyPagination({}, options);
    if (paginationParams.take !== undefined) {
      query = query.limit(paginationParams.take);
    }
    if (paginationParams.skip !== undefined) {
      query = query.offset(paginationParams.skip);
    }

    if (options && typeof options.Offset === 'string') {
      let operator = null;
      if (options.Offset[0] == '-') {
        operator = ' < ';
      } else if (options.Offset[0] == '+') {
        operator = ' > ';
      }
      if (operator) {
        query = query.andWhere(
          this.DefaultAlias +
          '.' +
          this.GetPrimaryColumnKey() +
          operator +
          this.GetPrimaryColumnValue(options.Offset.substr(1)),
        );
      }
    }
    return query;
  }
}
