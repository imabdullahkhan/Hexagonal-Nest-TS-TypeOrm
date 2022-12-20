import { CustomError } from './error';

export class Result<T> {
  public isSuccess: boolean;
  public isFailure: boolean;
  public error: CustomError;
  public _value: T;

  private constructor(isSuccess: boolean, error?: any, value?: T) {
    if (isSuccess && error) {
      throw new Error(`InvalidOperation: A result cannot be 
          successful and contain an error`);
    }
    if (!isSuccess && !error) {
      throw new Error(`InvalidOperation: A failing result 
          needs to contain an error message`);
    }

    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.error = error;
    this._value = value;

    Object.freeze(this);
  }

  public getValue(): T {
    if (!this.isSuccess) {
      throw new Error(`Cant retrieve the value from a failed result.`);
    }

    return this._value;
  }

  public static ok<T>(value?: T): Result<T> {
    return new Result<T>(true, null, value);
  }

  public static fail<T>(error: CustomError): Result<T> {
    return new Result<T>(false, error);
  }

  public static combine(results: Result<any>[]): Result<any> {
    for (let result of results) {
      if (result.isFailure) return result;
    }
    return Result.ok<any>();
  }
}
