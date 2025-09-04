import { Response } from 'express';
import { IResponse } from '../interface/response.interface';

export const sendResponse = <T>(res: Response, data: IResponse<T>) => {
  res.status(data.statusCode).json({
    success: data?.success,
    message: data?.message,
    statusCode: data?.statusCode,
    data: data?.data,
  });
};
