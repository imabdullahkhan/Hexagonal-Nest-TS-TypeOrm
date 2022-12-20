import { Controller, HttpStatus } from '@nestjs/common';
import { NODE_ENV, RESPONSE_STATUS, RESPONSE_STATUS_CODE } from '../constants';
import { ErrorModel } from '../types/error';
import { ResponseData } from '../utils/interfaces/ResponseData';
import { Response } from 'express';
import { CustomError } from '../types/error';
import { ConfigService } from '@nestjs/config';

type Settings = {
  result: any;
  res: Response;
  successMessage?: string;
  code: number;
};
@Controller()
export class BaseController {
  constructor(public configService?: ConfigService) {}

  protected sendError(err: CustomError, res: Response): any {
    return res.status(err.code || 500).json({
      status: false,
      error: {
        code: err.code || 500,
        error: err.message || 'Server Error',
      },
      data: null,
    });
  }

  protected success(data: any = {}, res: Response, code = 200): any {
    return res.status(code).json({
      status: true,
      code: code,
      message: 'success',
      data: data,
    }) as any;
  }

  sendResponse({
    result = [],
    res,
    successMessage,
    code = RESPONSE_STATUS_CODE.SUCCESS,
  }: {
    result: any;
    res: Response;
    successMessage?: string;
    code?: number;
  }) {
    if (result instanceof ErrorModel) {
      return this.createResponse(
        result.status,
        result.message,
        null,
        result.error,
        res,
        code
      );
    } else {
      return this.createResponse(
        RESPONSE_STATUS.SUCCESS,
        successMessage,
        result,
        null,
        res
      );
    }
  }

  createResponse(
    status: boolean,
    message: string,
    data: any,
    error: any,
    res: Response,
    statusCode?: number
  ) {
    const environment =
      this.configService?.get<string>('NODE_ENV') || NODE_ENV.PRODUCTION;
    const serviceResponse: ResponseData = {
      status,
      message,
      data,
      error: error,
    };
    if (!status) {
      const err = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
      serviceResponse.error = err;
      statusCode = statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
      if (environment !== NODE_ENV.DEVELOPMENT) {
        serviceResponse.error = null;
      }
      return res.status(statusCode).send(serviceResponse);
    }
    if (environment !== NODE_ENV.DEVELOPMENT) {
      serviceResponse.error = null;
    }
    return res.status(HttpStatus.OK).send(serviceResponse);
  }
}
