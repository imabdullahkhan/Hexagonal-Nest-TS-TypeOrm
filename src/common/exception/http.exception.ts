import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  BadRequestException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { MessageTemplates } from '../constants';
function PrepareBadRequestValidationErrors(errors) {
  const Errors: any = {};
  for (const err of errors) {
    const constraint =
      err.constraints &&
      Object.values(err.constraints) &&
      Object.values(err.constraints).length &&
      Object.values(err.constraints)[0];
    Errors[err.property] = constraint ? constraint : `${err.property} is invalid`;
  }
  return Errors;
}
@Catch(HttpException, Error)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException | Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: any = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    if (!(exception instanceof HttpException)) {
      console.log(exception.stack ? exception.stack : exception, 'ERROR');
      const ResponseToSend = {
        message: MessageTemplates.InternalServerError,
        values: null,
        code: HttpStatus.INTERNAL_SERVER_ERROR,
      };
      response.__ss_body = ResponseToSend;
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(ResponseToSend);
      return;
    }
    const status = exception.getStatus();
    const exceptionResponse: any = exception.getResponse();
    if (
      exception instanceof BadRequestException &&
      exceptionResponse.message &&
      Array.isArray(exceptionResponse.message)
    ) {

      const ResponseToSend = {
        message: MessageTemplates.InvalidValueFor,
        values: exceptionResponse.message,
        code: status,
      };
      response.__ss_body = ResponseToSend;
      response.status(status).json(ResponseToSend);
    } else {
      const ResponseToSend = {
        message: exceptionResponse.key || MessageTemplates.NotFoundError,
        values: exceptionResponse?.data || null,
        code: status,
      };
      response.__ss_body = ResponseToSend;
      response.status(status).json(ResponseToSend);
    }
  }
}
