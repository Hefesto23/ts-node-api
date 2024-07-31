import prisma from '@config/prisma';
import { Token, TokenType } from "@prisma/client";
import { ICreateTokenRequest } from "../interfaces";
import { BatchPayload } from '../types';

interface IUserTokenRepo {
  create: ({ token, userId, expires, type, blacklisted}:  ICreateTokenRequest) => Promise<Token>,
  verifyToken: (token: string, type: TokenType, userId: string) => Promise<Token | null>,
  getRefreshToken: (token: string, type: TokenType) => Promise<Token | null>,
  deleteToken: (tokenId: string) => Promise<Token | null>,
}

class UserTokenRepo implements IUserTokenRepo {
  /**
   * Cria um novo token de usuário
   * @param {ICreateTokenRequest} - Dados para a criação do token
   * @returns {Promise<Token>} - O token criado
   */
  create = async ({token, userId, expires, type, blacklisted = false}: ICreateTokenRequest): Promise<Token> => {
    return prisma.token.create({
      data: {
        token,
        userId,
        expires,
        type,
        blacklisted
      }
    });
  }

  /**
   * Verifica se token existe no sistema
   * @param {string} token - O token a ser verificado
   * @param {TokenType} type - O tipo de token
   * @param {string} userId - O id do usuário associado ao token
   * @returns {Promise<Token | null>} - O token válido ou null se não for encontrado
   */
  verifyToken = async (token: string, type: TokenType, userId: string): Promise<Token | null> => {
    return prisma.token.findFirst({
      where: { token, type, userId, blacklisted: false }
    });
  }

   /**
   * Obtém um token de refresh
   * @param {string} token - O token de refresh
   * @param {TokenType} type - O tipo de token
   * @returns {Promise<Token | null>} - O token de refresh encontrado ou null se não for encontrado
   */
  getRefreshToken = async (token: string, type: TokenType): Promise<Token | null> => {
    return prisma.token.findFirst({
      where: { token, type, blacklisted: false }
    });
  }

  /**
   * Deleta um token
   * @param {string} tokenId - O id do token a ser deletado
   * @returns {Promise<Token | null>} - O token deletado ou null se não for encontrado
   */
  deleteToken = async (tokenId: string): Promise<Token | null> => {
    return prisma.token.delete({
      where: { id: tokenId }
    });
  }

  /**
   * Deleta todos os tokens de um tipo específico de um usuário
   * @param {string} userId - O id do usuário
   * @param {TokenType} type - O tipo de token
   * @returns {Promise<BatchPayload>} - A quantidade de tokens deletados
   */
  deleteMany = async (userId: string, type: TokenType): Promise<BatchPayload> => {
    return prisma.token.deleteMany({
      where: { userId: userId, type: type }
    });
  }
}

  export { IUserTokenRepo, UserTokenRepo };

