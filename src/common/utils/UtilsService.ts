import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ErrorModel } from '../types/error';

@Injectable()
export class UtilsService {
  getIndexByProperty(targetArray: any[], key: string, value: string) {
    try {
      const index = targetArray.findIndex((item) => item[key] === value);
      return index;
    } catch (error) {
      console.log(error);
    }
  }

  groupByProperty(targetArray: any[], key: string) {
    return targetArray.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }

  static toNumber = (value: string) => {
    const newValue: number = Number.parseInt(value);
    return newValue;
  };

  getErrorModel(status: boolean, message: string, error: Error): ErrorModel {
    return new ErrorModel(status, message, error);
  }

  static getErrorModelStatic(
    status: boolean,
    message: string,
    error: Error
  ): ErrorModel {
    return new ErrorModel(status, message, error);
  }
}
