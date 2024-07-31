import ApiError from '@shared/error/api.error';
import subObj from '@shared/utils/object-map';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import Joi from 'joi';

/**
 * Valida a requisição recebida em relação ao esquema fornecido e lida com erros.
 *
 * @param {object} schema - O esquema para validar a requisição
 * @return {void}
 */
const validate = (schema: object) => (req: Request, res: Response, next: NextFunction) => {
  const validSchema = subObj(schema, ['params', 'query', 'body']);
  const obj = subObj(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' }, abortEarly: false })
    .validate(obj);
  if (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errorMessage = error.details.map((details: any) => details.message).join(', ');
    return next(new ApiError(errorMessage, httpStatus.BAD_REQUEST));
  }
  Object.assign(req, value);
  return next();
};

export default validate;
