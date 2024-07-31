import { roleRights } from '@config/roles';
import { User } from '@prisma/client';
import ApiError from '@shared/error/api.error';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import passport from 'passport';

// **** Middlewares para Autenticação e Autorização de Requisições de Usuários ****

/**
 * Callback para verificação de autenticação do usuário.
 *
 * @param {any} req - Objeto de requisição do express.
 * @param {(value?: unknown) => void} resolve - Função de resolução do Promise.
 * @param {(reason?: unknown) => void} reject - Função de rejeição do Promise.
 * @param {string[]} requiredRights - Permissões necessárias para acesso.
 * @return {Promise<void>} Promessa vazia.
 */
const verifyCallback =
  (
    req: any,
    resolve: (value?: unknown) => void,
    reject: (reason?: unknown) => void,
    requiredRights: string[]
  ) =>
  async (err: unknown, user: User | false, info: unknown) => {
    if (err || info || !user) {
      return reject(new ApiError('Usuário não autenticado!', httpStatus.UNAUTHORIZED));
    }
    req.user = user;

    // O usuário foi autenticado. Agora, precisamos verificar se ele tem
    // as permissões necessárias para acessar o recurso que está sendo requisitado
    // O parâmetro "requiredRights" é uma lista de permissões que o usuário precisa ter
    // para acessar o recurso. Se o usuário não tiver todas as permissões necessárias,
    // ele será negado o acesso
    if (requiredRights.length) {
      const userRights = roleRights.get(user.role) ?? [];
      const hasRequiredRights = requiredRights.every((requiredRight) =>
        userRights.includes(requiredRight)
      );

      // Verifica se o usuário tem todas as permissões necessárias para acessar o recurso
      // Se o usuário não tiver todas as permissões necessárias, mas estiver tentando acessar o seu próprio perfil
      // é permitido o acesso para que ele possa editar suas informações
      // Caso contrário, retorne um erro (403 - Forbidden)
      if (!hasRequiredRights && req.params.userId !== user.id) {
        return reject(new ApiError('Sem permissão necessária(Forbidden)!',httpStatus.FORBIDDEN));
      }
    }

    resolve();
  };

/**
 * Verifica se o usuário está autenticado e tem as permissões necessárias
 * para acessar o recurso que está sendo requisitado.
 * @param  {...string} requiredRights - Permissões necessárias para acesso.
 * @return {Promise<void>} Promessa vazia.
 */
const auth =
  (...requiredRights: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    return new Promise((resolve, reject) => {
      // A função passport.authenticate verifica se o token JWT recebido na requisição
      // é válido. Caso seja, ele extrai o ID do usuário da requisição e o coloca em req.user.
      // Caso o token seja inválido, ele retorna um erro (401 - Unauthorized)
      passport.authenticate(
        'jwt',
        { session: false },
        verifyCallback(req, resolve, reject, requiredRights)
      )(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));
  };

export default auth;
