import { ErrorInterface } from '../utils/interfaces/ErrorInterface';

export class CustomError extends Error {
  public code: number;

  constructor(message: string, code?: number) {
    super(message);
    this.code = code;
  }
}

export class ErrorModel implements ErrorInterface {
  status: boolean;
  message: string;
  error: Error;

  constructor(status: boolean, message: string, error: Error) {
    this.status = status;
    this.message = message;
    this.error = error;
  }
}
