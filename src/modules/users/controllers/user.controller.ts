import ApiError from '@shared/error/api.error';
import catchAsync from '@shared/http/middlewares/catch-async';
import subObject from '@shared/utils/object-map';
import httpStatus from 'http-status';
import userService from '../services/user.service';

/**
 * Cria um novo usuário com as informações fornecidas.
 *
 * @param {Object} req - O objeto de requisição do Express.
 * @param {Object} res - O objeto de resposta.
 * @param {string} req.body.email - O email do usuário.
 * @param {string} req.body.senha - A senha do usuário.
 * @param {string} [req.body.nome] - O nome do usuário.
 * @param {Role} [req.body.role] - O cargo/função do usuário no sistema.
 * @return {Promise<void>} Uma promise que resolve para o usuário criado.
 * @throws {ApiError} Retorna erro Se o email informado já está cadastrado.
 */
const createUser = catchAsync(async (req, res) => {
  const { email, cnpj, senha, nome, role } = req.body;

  const emailExists = await userService.userEmailExists(email);
  if (emailExists) {
    throw new ApiError('Email já está cadastrado, o usuário não pode ser criado!', 409);
  }
  const user = await userService.createUser(email, cnpj, senha, nome, role);
  res.status(httpStatus.CREATED).send(user);
});

/**
 * Retorna uma lista de usuários que correspondem aos filtros informados.
 *
 * @param {Object} req - O objeto de requisição do Express.
 * @param {Object} res - O objeto de resposta.
 * @return {Promise<void>} Uma promise que resolve para a lista de usuários.
 */
const queryUsers = catchAsync(async (req, res) => {
  const where = subObject(req.query, ['nome', 'role', 'cnpj', 'email']);
  const options = subObject(req.query, ['orderBy', 'take', 'skip']);
  const result = await userService.queryUsers(where, options);
  res.send(result);
});

/**
 * Retorna um usuário que corresponda ao ID informado.
 *
 * @param {Object} req - O objeto de requisição do Express.
 * @param {Object} res - O objeto de resposta.
 * @param {string} req.params.userId - O ID do usuário.
 * @return {Promise<void>} Uma promise que resolve para o usuário.
 * @throws {ApiError} Retorna erro Se o ID do usuário não for encontrado.
 */
const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError('Usuário não encontrado!', httpStatus.NOT_FOUND);
  }
  res.send(user);
});

/**
 * Atualiza um usuário existente com as informações fornecidas.
 *
 * @param {Object} req - O objeto de requisição do Express.
 * @param {Object} res - O objeto de resposta.
 * @param {string} req.params.userId - O ID do usuário a ser atualizado.
 * @param {string} [req.body.email] - O novo email do usuário.
 * @param {Object} [req.body] - As novas informações do usuário.
 * @return {Promise<void>} Uma promise que resolve para o usuário atualizado.
 * @throws {ApiError} Retorna erro Se o email informado já está cadastrado e é diferente do email do usuário.
 * @throws {ApiError} Retorna erro Se o ID do usuário não for encontrado.
 */
const updateUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { email } = req.body;
  const user = await userService.getUserById(userId,['id', 'email', 'nome', 'role']);
  if (!user) {
    throw new ApiError( 'Usuário não encontrado!', httpStatus.NOT_FOUND);
  }

  if (email && (await userService.getUserByEmail(email as string))) {
    throw new ApiError('Email já está cadastrado!', httpStatus.BAD_REQUEST);
  }
  const updatedUser = await userService.updateUserById( userId, req.body);
  res.status(httpStatus.ACCEPTED).send(updatedUser);
});

/**
 * Deleta um usuário existente.
 *
 * @param {Object} req - O objeto de requisição do Express.
 * @param {Object} res - O objeto de resposta.
 * @param {string} req.params.userId - O ID do usuário a ser deletado.
 * @return {Promise<void>} Uma promise que resolve para o usuário deletado.
 * @throws {ApiError} Retorna erro Se o ID do usuário não for encontrado.
 */
const deleteUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError('Usuário não encontrado!', httpStatus.NOT_FOUND);
  }
  const userDeleted = await userService.deleteUserById(user.id);
  res.status(httpStatus.OK).send(userDeleted);
});

export default {
  createUser,
  queryUsers,
  getUser,
  updateUser,
  deleteUser
};
