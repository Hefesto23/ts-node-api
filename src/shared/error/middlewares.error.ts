import config from '@config/config';
import logger from '@config/logger';
import { Prisma } from '@prisma/client';
import ApiError from '@shared/error/api.error';
import { ErrorRequestHandler } from 'express';
import httpStatus from 'http-status';

/**
 * Middleware de conversão de erros que converte erros que não são ApiError para o formato ApiError.
 *
 * @param {any} err - O objeto de erro a ser convertido.
 * @param {Request} req - O objeto de requisição.
 * @param {Response} res - O objeto de resposta.
 * @param {NextFunction} next - A próxima função middleware.
 */
export const errorConverter: ErrorRequestHandler = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || error instanceof Prisma.PrismaClientKnownRequestError
        ? httpStatus.BAD_REQUEST
        : httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(message,statusCode, false, err.stack);
  }
  next(error);
};

/**
 * Middleware para tratamento de erros. Converte objetos de erro não ApiError para o formato ApiError.
 *
 * @param {Error} err - O objeto de erro a ser convertido.
 * @param {Request} req - O objeto de requisição.
 * @param {Response} res - O objeto de resposta.
 * @param {NextFunction} next - A função de próximo middleware.
 * @return {void} Esta função não retorna nada.
 */
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  if (config.env === 'production' && !err.isOperational) {
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
  }

  res.locals.errorMessage = err.message;

  const response = {
    message,
    code: statusCode,
    ...(config.env === 'development' && { stack: err.stack })
  };

  if (config.env === 'development') {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};
