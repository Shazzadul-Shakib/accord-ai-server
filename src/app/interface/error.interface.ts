export interface IError {
  path: string | number | symbol | undefined;
  message: string;
}
export type TError = Array<IError>;

export type TGenericErrorResponse = {
  statusCode: number;
  message: string;
  error: TError;
};
