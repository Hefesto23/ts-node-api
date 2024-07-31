import { NextFunction, Request, Response } from 'express';
import { inHTMLData } from 'xss-filters';

/**
 * Função de limpeza para XSS.
 * @param {string/object} data - O valor a ser sanitizado
 * @return {string/object} O valor sanitizado
 */
export const clean = <T>(data: T | string = ''): T => {
  let isObject = false;
  if (typeof data === 'object') {
    data = JSON.stringify(data);
    isObject = true;
  }

  // O método `inHTMLData` é uma função do pacote `xss-filters` que realiza a limpeza de dados HTML. Ele remove tags HTML inválidas, atributos inválidos, caracteres especiais e codifica caracteres<|func_body|>
  data = inHTMLData(data as string).trim();
  if (isObject) data = JSON.parse(data);

  return data as T;
};

/**
 * Função de middleware que sanitiza o corpo da requisição, os parâmetros de consulta e os parâmetros de rota para proteção contra XSS.
 *
 * @param {Request} req - O objeto de requisição
 * @param {Response} res - O objeto de resposta
 * @param {NextFunction} next - A próxima função de middleware
 * @return {void}
 */
const middleware = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.body) req.body = clean(req.body);
    if (req.query) req.query = clean(req.query);
    if (req.params) req.params = clean(req.params);
    next();
  };
};

export default middleware;
