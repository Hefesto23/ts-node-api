import { Prisma, Role, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { prisma } from '../helpers/setupTest';

const senha = 'password1';
const salt = bcrypt.genSaltSync(8);

export const user1 = {
  nome: 'Macabeu Lima',
  email: 'maca@example.com',
  cnpj: '11111111111111',
  senha: "password1",
  role: Role.USER,
} as Prisma.UserCreateInput;

export const user2 = {
  nome: 'Viviane Furacão',
  email: 'viviane@prisma.io',
  cnpj: '22222222222222',
  senha,
  role: Role.USER,
} as Prisma.UserCreateInput;

export const user3 = {
  nome: 'Caio Quebra Barraco',
  email: 'caio@prisma.io',
  cnpj: '33333333333333',
  senha,
  role: Role.FINANCEIRO,
} as Prisma.UserCreateInput;

export const user4 = {
  nome: 'Jaian Luva de Predero',
  email: 'jaian@snapflow.com',
  cnpj: '44444444444444',
  senha,
  role: Role.MARKETING,
} as Prisma.UserCreateInput;

export const user5 = {
  nome: 'Gustavo Choaz Neguer Soares',
  email: 'gustavo@snapflow.com',
  cnpj: '55555555555555',
  senha,
  role: Role.MARKETING,
} as Prisma.UserCreateInput;

export const user6 = {
  id: 'b2bf52f2-189e-4c82-91f1-31dedbc2931a',
  nome: 'João Rei da Catuaba Roraimense',
  email: 'joao@prisma.io',
  cnpj: '66666666666666',
  senha,
  role: Role.USER,
} as Prisma.UserCreateInput;

export const admin = {
  nome: "Admin da Silva SnapFlow",
  email: 'admin@admin.com',
  cnpj: '77777777777777',
  senha,
  role: Role.ADMIN,
} as Prisma.UserCreateInput;

export const criarUsuarioTeste = async (user: Prisma.UserCreateInput): Promise<User> => {
  return await prisma.user.create({
    data: { ...user, senha: bcrypt.hashSync(user.senha, salt) }
  });
};

export const criarMultiUsuariosTestes = async (users: Prisma.UserCreateManyInput[]) => {
  await prisma.user.createMany({
    data: users.map((user) => ({ ...user, senha: bcrypt.hashSync(user.senha, salt) }))
  });
};

export const retornaUserPeloId = async (id: string): Promise<User | null> => {
  return prisma.user.findUnique({ where: { id } });
}
