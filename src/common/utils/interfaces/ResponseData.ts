export interface ResponseData {
  status: boolean;
  message: string;
  data: any;
  error: Error;
}

interface Error {
  name: string;
  message: string;
  stack: string;
}
