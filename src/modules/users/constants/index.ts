import { Key } from "../types";

export const FILTRO_PROPRIEDADES: Key[] = [
  'id',
  'email',
  'nome',
  'cnpj',
  'senha',
  'role',
  'isEmailVerified',
  'createdAt',
  'updatedAt'
];

export const FILTRO_SEM_SENHA: Key[] = [
  'id',
  'email',
  'nome',
  'cnpj',
  // 'senha',
  'role',
  'isEmailVerified',
  'createdAt',
  'updatedAt'
];
