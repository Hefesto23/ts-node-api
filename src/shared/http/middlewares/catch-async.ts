import { NextFunction, Request, Response } from 'express';
type CallbackFunction = (req: Request, res: Response, next: NextFunction) => Promise<void>;

/**
 * Envolve um handler assíncrono para capturar erros assíncronos
 *
 * @param {CallbackFunction} cb O handler assíncrono a ser envolvido
 * @returns {Promise<void>} O handler assíncrono envolvido
 */
export const catchAsync = (cb: CallbackFunction) => async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await cb(req, res, next);
  } catch (err) {
    // caso ocorra um erro, passa o erro para o middleware de tratamento de erros
    next(err);
  }
};

export default catchAsync;
