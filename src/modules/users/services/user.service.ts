import { Prisma, Role, User } from '@prisma/client';
import { FILTRO_SEM_SENHA } from '../constants';
import { UserRepo } from "../repositories/user.repository";
import { Key } from '../types';
import { criptografarSenha } from './password.service';

const userRepository = new UserRepo();

/**
 * Cria um novo usuário com as informações fornecidas.
 *
 * @param {string} email - O email do usuário.
 * @param {string} cnpj - O CNPJ do usuário.
 * @param {string} senha - A senha do usuário.
 * @param {string} nome - O nome do usuário.
 * @param {Role} role - O cargo/função do usuário no sistema.
 * @return {Promise<User>} Uma promise que resolve para o usuário criado.
*/
const createUser = async (
  email: string,
  cnpj: string,
  senha: string,
  nome?: string,
  role?: Role
): Promise<User> => {

  return userRepository.create({
      email,
      nome,
      cnpj,
      senha: await criptografarSenha(senha),
      role: role ? role : Role.USER,
  });
};

/**
 * Verifica se um usuário existe com o email fornecido.
 *
 * @param {string} email - O email a ser pesquisado.
 * @return {Promise<boolean>} Uma promise que resolve para <true>
 * caso se um usuário existir com o email fornecido, <false> caso contrário.
*/
 const userEmailExists = async (email: string): Promise<boolean> => {
    return userRepository.existsByField('email', email);
  }

/**
 * Consulta de usuários com base em um filtro - queryUsers function
 *
 * @param {object} where - Filtro do Prisma
 * @param {object} options - Opções da consulta
 * @param {number} [options.take] - Número máximo de resultados por página (padrão = 10)
 * @param {number} [options.skip] - Número de resultados a pular
 * @param {object} [options.orderBy] - Opção de ordenação no formato: campoDeOrdenação:(desc|asc)
 * @param {Key[]} [keys=FILTRO_SEM_SENHA] - Array de chaves a serem selecionadas
 * @return {Promise<Pick<User, Key>[]} Um array de usuários com as chaves selecionadas
 */
const queryUsers = async(
  where: object,
  options: {
    take?: number;
    skip?: number;
    orderBy?: object;
  },
  keys: Key[] = FILTRO_SEM_SENHA
): Promise<Pick<User, Key>[]> => {
  const select = keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  return userRepository.queryUsers(
    where,
    options,
    select
  );
};

/**
 * Pesquisa um usuário pelo ID
 * @param {string} userId
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<User, Key> | null>}
 */
const getUserById = async (
  id: string,
  keys: Key[] = FILTRO_SEM_SENHA
): Promise<Pick<User, Key> | null> => {
  const select = keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  return userRepository.findById(id, select) as Promise<Pick<User, Key> | null>;
};

/**
 * Pesquisa um usuário pelo email
 * @param {string} email
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<User, Key> | null>}
 */
const getUserByEmail = async (
  email: string,
  keys: Key[] = FILTRO_SEM_SENHA
): Promise<Pick<User, Key> | null> => {
  const select = keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  return userRepository.findByEmail(
    email,
    select
  ) as Promise<Pick<User, Key> | null>;
};

/**
 * Atualiza um usuário pelo ID
 * @param {string} userId
 * @param {object} updateBody
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<User, Key> | null>}
 */
const updateUserById = async (
  userId: string,
  updateBody: Prisma.UserUpdateInput,
  keys: Key[] = FILTRO_SEM_SENHA
): Promise<Pick<User, Key> | null> => {
  const select = keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  const updatedUser = await userRepository.update( userId, updateBody,select);
  return updatedUser as Pick<User, Key> | null;
};

/**
 * Deleta um usuário pelo ID
 * @param {string} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId: string): Promise<User> => {
  return userRepository.delete(userId);
};

export default {
  createUser,
  userEmailExists,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById
};
