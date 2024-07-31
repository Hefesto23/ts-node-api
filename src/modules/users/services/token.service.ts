import config from '@config/config';
import { Token, TokenType } from '@prisma/client';
import ApiError from '@shared/error/api.error';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import moment, { Moment } from 'moment';
import { IAuthTokensResponse } from '../interfaces';
import { UserTokenRepo } from '../repositories/user-token.repository';
import userService from './user.service';

const userTokenRepo = new UserTokenRepo();

/**
 * Gerador de token a partir de parâmetros
 * @param {string} userId id do usuário
 * @param {Moment} expires data de expiração
 * @param {string} type tipo do token
 * @param {string} [secret] chave de segurança
 */
const generateToken = (
  userId: string,
  expires: Moment,
  type: TokenType,
  secret = config.jwt.secret
): string => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type
  };
  return jwt.sign(payload, secret);
};

/**
 * Salva o token no Banco de Dados
 * @param {string} token token gerado
 * @param {string} userId id do usuário
 * @param {Moment} expires data de expiração
 * @param {string} type tipo do token
 * @param {boolean} [blacklisted] se o token estiver blacklisted
 * @returns {Promise<Token>}
 */
const saveToken = async (
  token: string,
  userId: string,
  expires: Moment,
  type: TokenType,
  blacklisted = false
): Promise<Token> => {
  return userTokenRepo.create({token, userId, expires: expires.toDate(), type, blacklisted});
};

/**
 * Verifica se o token existe no Banco de Dados e retorna os dados do token correspondente
 * @param {string} token token gerado
 * @param {string} type tipo do token
 * @returns {Promise<Token>}
 */
const verifyToken = async (token: string, type: TokenType): Promise<Token> => {
  const payload = jwt.verify(token, config.jwt.secret);
  const userId = String(payload.sub);
  const tokenData = await userTokenRepo.verifyToken(token, type, userId);
  if (!tokenData) {
    throw new Error('Token não foi encontrado!');
  }
  return tokenData;
};

/**
 * Gerador de tokens de acesso e refresh da autenticação de usuário
 * @param {User} user dados do usuário e seu id
 * @returns {Promise<IAuthTokensResponse>} tokens de acesso e refresh e suas datas de expiração
 */
const generateAuthTokens = async (user: { id: string }): Promise<IAuthTokensResponse> => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = generateToken(user.id, accessTokenExpires, TokenType.ACCESS);

  const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
  const refreshToken = generateToken(user.id, refreshTokenExpires, TokenType.REFRESH);
  await saveToken(refreshToken, user.id, refreshTokenExpires, TokenType.REFRESH);

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate()
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate()
    }
  };
};

/**
 * Gerador de token de redefinição de senha
 * @param {string} email email do usuário
 * @returns {Promise<string>} token de redefinição de senha
 */
const generateResetPasswordToken = async (email: string): Promise<string> => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError('Nenhum usuário encontrado com esse email', httpStatus.NOT_FOUND);
  }
  const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
  const resetPasswordToken = generateToken(user.id, expires, TokenType.RESET_PASSWORD);
  await saveToken(resetPasswordToken, user.id, expires, TokenType.RESET_PASSWORD);
  return resetPasswordToken;
};

/**
 * Gerador de token de verificação de email
 * @param {User} user dados do usuário cujo token de verificação deve ser gerado
 * @returns {Promise<string>} token de verificação
 */
const generateVerifyEmailToken = async (user: { id: string }): Promise<string> => {
  const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
  const verifyEmailToken = generateToken(user.id, expires, TokenType.VERIFY_EMAIL);
  await saveToken(verifyEmailToken, user.id, expires, TokenType.VERIFY_EMAIL);
  return verifyEmailToken;
};

export default {
  generateToken,
  saveToken,
  verifyToken,
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken
};
