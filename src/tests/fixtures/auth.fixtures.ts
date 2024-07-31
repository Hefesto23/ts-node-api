import { Prisma, Token } from "@prisma/client";
import bcrypt from 'bcrypt';
import { prisma } from '../helpers/setupTest';

export const userAuth1 = {
  nome: 'Gustavo Choaz Neguer Soares',
  email: 'gustavo@snapflow.com',
  cnpj: '55555555555555',
  senha: 'password1',
} as Prisma.UserCreateInput;

export const userAuth2 = {
  nome: 'Lucas "Menino Bom" da Silva',
  email: 'lucas@snapflow.com',
  cnpj: '66666666666666',
  senha: 'password2',
} as Prisma.UserCreateInput;

export const userAuth3 = {
  nome: 'Alan Brado',
  email: 'emailInvalido',
  cnpj: '77777777777777',
  senha: 'password3',
}

export const userAuth4 = {
  id: 'c2bf52f2-189e-4c82-91f1-31dedbc2931a',
  nome: 'Caio Quebra Barraco',
  email: 'caio@snapflow.com',
  cnpj: '88888888888888',
  senha: 'password4',
}

export const retornaToken = async (refreshToken: string): Promise<Token | null> => {
  return prisma.token.findFirst({ where: { token: refreshToken } });
};

export const comparadorDeSenha = async (senha: string, senhaCriptografada: string): Promise<boolean> => {
  return bcrypt.compare(senha, senhaCriptografada);
};

