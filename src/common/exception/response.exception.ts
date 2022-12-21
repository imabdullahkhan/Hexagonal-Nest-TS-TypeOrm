// export abstract class ResponseException {
//   Data: any;
//   Status: number;
//   Message: string;

import { HttpException, HttpStatus } from '@nestjs/common';
import { MessageTemplates } from '../constants';

//   protected constructor(message: string, data?: any, ...args) {
//     if (data == undefined) {
//       data = null;
//     }
//     this.Data = data;
//     this.Message = message;
//   }

//   public GetMessage(): string {
//     return this.Message;
//   }

//   public GetStatus(): number {
//     return this.Status;
//   }

//   public GetPreparedResponse() {
//     return {
//       Message: this.Message,
//     };
//   }
// }

// export class ForbiddenException extends ResponseException {
//   Status = ResponseCode.FORBIDDEN;

//   constructor(message?: string, data?: any, ...args) {
//     super(message || ResponseMessage.FORBIDDEN, data, ...args);
//   }

//   public GetPreparedResponse() {
//     return {
//       Message: this.Message,
//       ...(this.Data && { Data: this.Data }),
//     };
//   }
// }

// export class UnAuthorizedException extends ResponseException {
//   Status = ResponseCode.UNAUTHORIZED;

//   constructor(message?: string, ...args) {
//     super(message || ResponseMessage.UNAUTHORIZED, null, ...args);
//   }
// }

// export class NotFoundException extends ResponseException {
//   Status = ResponseCode.NOT_FOUND;

//   constructor(message?: string, ...args) {
//     super(message || ResponseMessage.NOT_FOUND, null, ...args);
//   }
// }

// export class FatalErrorException extends ResponseException {
//   Status = ResponseCode.SERVER_ERROR;

//   constructor(message?: string, ...args) {
//     super(message || ResponseMessage.SERVER_ERROR, null, ...args);
//   }
// }

// export class BadRequestException extends ResponseException {
//   Status = ResponseCode.BAD_REQUEST;

//   constructor(data?: any, message?: string, ...args) {
//     super(message || ResponseMessage.BAD_REQUEST, data, ...args);
//   }

//   public GetPreparedResponse() {
//     return {
//       Message: this.Message,
//       Errors: this.Data,
//     };
//   }
// }

// export enum ResponseCode {
//   OK = 200,
//   SUCCESS_WITH_NO_CONTENT = 204,
//   BAD_REQUEST = 400,
//   UNAUTHORIZED = 401,
//   ACCOUNT_SUSPENDED = 402,
//   FORBIDDEN = 403,
//   NOT_FOUND = 404,
//   SERVER_ERROR = 500,
// }

// export enum ResponseMessage {
//   UNAUTHORIZED = 'Unauthorized for request. Token Mismatch.',
//   SUCCESS = 'Success',
//   SUCCESS_WITH_NO_CONTENT = 'No Content',
//   FORBIDDEN = 'Not allowed for performing this action.',
//   BAD_REQUEST = 'Bad Request. Please verify your request input.',
//   SERVER_ERROR = 'Internal Server Error',
//   NOT_FOUND = 'Resource Not found',
//   ACCOUNT_SUSPENDED = 'Account is Suspended.',
// }

export class NotFoundException extends HttpException {
  constructor(key: string = MessageTemplates.NotFoundError, data?: any) {
    super({ key, data }, HttpStatus.NOT_FOUND);
  }
}
export class UnAuthorizedException extends HttpException {
  constructor(key: string = MessageTemplates.UnauthorizedError, data?: any) {
    super({ key, data }, HttpStatus.UNAUTHORIZED);
  }
}
export class BadRequestException extends HttpException {
  constructor(key: string = MessageTemplates.BadRequestError, data?: any) {
    super({ key, data }, HttpStatus.BAD_REQUEST);
  }
}
export class ForbiddenException extends HttpException {
  constructor(key: string = MessageTemplates.ForbiddenError, data?: any) {
    super({ key, data }, HttpStatus.FORBIDDEN);
  }
}
export class FatalErrorException extends HttpException {
  constructor(key: string = MessageTemplates.InternalServerError, data?: any) {
    super({ key, data }, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
