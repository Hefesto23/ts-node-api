/* eslint-disable @typescript-eslint/no-explicit-any */
import config from "@config/config";
import tokenService from '@modules/users/services/token.service';
import { TokenType } from "@prisma/client";
import moment from "moment";
import { prisma } from "../helpers/setupTest";

const dataValidadeToken = moment().add(config.jwt.accessExpirationMinutes, 'minutes');

export const gerarTokenTeste = async (id: string, type: TokenType, blackList = false,  secret?: any) => {
  let token:string;
  if(secret){
    token = await tokenService.generateToken(id, dataValidadeToken, type, secret);
  } else {
    token = await tokenService.generateToken(id, dataValidadeToken, type);
  }
  await tokenService.saveToken(token,id, dataValidadeToken, type, blackList);
  return token;
}

export const gerarTokenExpirado = async (id: string, type: TokenType) => {
  const dataExpirada = moment().subtract(1, 'minutes');
  const refreshToken =  await tokenService.generateToken(id, dataExpirada, type);
  await tokenService.saveToken(refreshToken, id, dataExpirada, type);
  return refreshToken;
}

export const gerarTokenSemDB = async (id: string, type: TokenType) => {
  return tokenService.generateToken(id, dataValidadeToken, type);
}

export const contadorDeTokens = async (id: string , type: TokenType) => {
  return prisma.token.count({
    where: {
      id,
      type,
    }
  });
}
