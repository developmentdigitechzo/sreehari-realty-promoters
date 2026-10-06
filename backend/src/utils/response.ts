import { Response } from 'express';
import { ApiResponse } from '../types/index.js';

export const sendSuccess = <T>(res: Response, message: string, data?: T, statusCode = 200) => {
  const responseBody: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  return res.status(statusCode).json(responseBody);
};

export const sendError = (res: Response, message: string, error?: any, statusCode = 500) => {
  const responseBody: ApiResponse = {
    success: false,
    message,
    error: process.env.NODE_ENV === 'production' && statusCode === 500 
      ? 'An unexpected error occurred. Please try again later.' 
      : error,
  };
  return res.status(statusCode).json(responseBody);
};
