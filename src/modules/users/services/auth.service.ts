import { TokenType, User } from '@prisma/client';
import ApiError from '@shared/error/api.error';
import exclude from '@shared/utils/exclude';
import httpStatus from 'http-status';
import { FILTRO_PROPRIEDADES } from '../constants';
import { UserTokenRepo } from '../repositories/user-token.repository';
import { AuthTokensResponse } from '../types';
import { comparadorDeSenhas, criptografarSenha } from './password.service';
import tokenService from './token.service';
import userService from './user.service';


const userTokenRepo = new UserTokenRepo();

/**
 * Login com usuário e senha
 * @param {string} email email do usuário
 * @param {string} senha senha definida
 * @returns {Promise<Omit<User, 'senha'>>} dados do usuário com senha ocultada
 */
const loginUserWithEmailAndPassword = async (
  email: string,
  senha: string
): Promise<Omit<User, 'senha'>> => {
  const user = await userService.getUserByEmail(email, FILTRO_PROPRIEDADES);
  if (!user || !(await comparadorDeSenhas(senha, user.senha as string))) {
    throw new ApiError('Email ou senha inválidos', httpStatus.BAD_REQUEST);
  }
  return exclude(user, ['senha']);
};

/**
 * Logout de um usuário
 * @param {string} refreshToken token de atualização
 * @returns {Promise<void>}
 */
const logout = async (refreshToken: string): Promise<void> => {
  const refreshTokenData = await userTokenRepo.getRefreshToken(refreshToken, TokenType.REFRESH);
  if (!refreshTokenData) {
    throw new ApiError('Token não encontrado',httpStatus.NOT_FOUND);
  }
  await userTokenRepo.deleteToken(refreshTokenData.id);
};

/**
 * Atualiza o token de acesso refreshToken de um usuário
 * @param {string} refreshToken token de atualização
 * @returns {Promise<AuthTokensResponse>}
 */
const refreshAuth = async (refreshToken: string): Promise<AuthTokensResponse> => {
  try {
    const refreshTokenData = await tokenService.verifyToken(refreshToken, TokenType.REFRESH);
    const { userId } = refreshTokenData;
    await userTokenRepo.deleteToken( refreshTokenData.id);
    return tokenService.generateAuthTokens({ id: userId });
  } catch (error) {
    throw new ApiError('Por favor, autentique-se!', httpStatus.UNAUTHORIZED);
  }
};

/**
 * Redefine a senha de um usuário
 * @param {string} resetPasswordToken token de redefinição de senha
 * @param {string} newPassword nova senha
 * @returns {Promise<void>}
 */
const resetPassword = async (resetPasswordToken: string, newPassword: string): Promise<void> => {
  try {
    const resetPasswordTokenData = await tokenService.verifyToken(
      resetPasswordToken,
      TokenType.RESET_PASSWORD
    );
    const user = await userService.getUserById(resetPasswordTokenData.userId);
    if (!user) {
      throw new Error();
    }
    const encryptedPassword = await criptografarSenha(newPassword);
    await userService.updateUserById(user.id, { senha: encryptedPassword });

    await userTokenRepo.deleteMany(user.id, TokenType.RESET_PASSWORD);
  } catch (error) {
    throw new ApiError('Renovação de senha falhou', httpStatus.UNAUTHORIZED);
  }
};

/**
 * Verifica o email de um usuário
 * @param {string} verifyEmailToken token de verificação de email
 * @returns {Promise<void>}
 */
const verifyEmail = async (verifyEmailToken: string): Promise<void> => {
  try {
    const verifyEmailTokenData = await tokenService.verifyToken(
      verifyEmailToken,
      TokenType.VERIFY_EMAIL
    );
    await userTokenRepo.deleteMany(verifyEmailTokenData.userId, TokenType.VERIFY_EMAIL);
    await userService.updateUserById(verifyEmailTokenData.userId, { isEmailVerified: true });
  } catch (error) {
    throw new ApiError('Verificação de email falhou', httpStatus.UNAUTHORIZED);
  }
};

export default {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail
};
