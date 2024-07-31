import { User } from '@prisma/client';
import catchAsync from '@shared/http/middlewares/catch-async';
import exclude from '@shared/utils/exclude';
import httpStatus from 'http-status';
import { authService, emailService, tokenService, userService } from '../services';


/**
 * Registra um novo usuário.
 *
 * @param {Object} req - O objeto de solicitação.
 * @param {Object} res - O objeto de resposta.
 * @return {Promise<void>} - Uma Promise que resolve quando a resposta é enviada.
 */
const register = catchAsync(async (req, res) => {
  const { email, cnpj , senha, nome } = req.body;
  const user = await userService.createUser(email, cnpj, senha, nome);
  const userWithoutPassword = exclude(user, ['senha', 'createdAt', 'updatedAt']);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user: userWithoutPassword, tokens });
});

/**
 * Faz login de um usuário.
 *
 * @param {Object} req - O objeto de solicitação.
 * @param {Object} res - O objeto de resposta.
 * @return {Promise<void>} - Uma Promise que resolve quando a resposta é enviada.
 */
const login = catchAsync(async (req, res) => {
  const { email, senha } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, senha);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

/**
 * Logout de um usuário.
 *
 * @param {Object} req - O objeto de solicitação.
 * @param {Object} res - O objeto de resposta.
 * @return {Promise<void>} - Uma Promise que resolve quando a resposta é enviada.
 */
const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * Atualiza o token de acesso do usuário.
 *
 * @param {Object} req - O objeto de solicitação.
 * @param {Object} res - O objeto de resposta.
 * @return {Promise<void>} - Uma Promise que resolve quando a resposta é enviada.
 */
const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

/**
 * Envia um e-mail de redefinição de senha para um usuário.
 *
 * @param {Object} req - O objeto de requisição do Express.
 * @param {Object} res - O objeto de resposta.
 * @return {Promise<void>} Uma promise que resolve para o usuário atualizado.
 */
const forgotPassword = catchAsync(async (req, res) => {
  const {email} = req.body;
  const resetPasswordToken = await tokenService.generateResetPasswordToken(email);
  await emailService.sendResetPasswordEmail(email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * Atualiza a senha de um usuário.
 *
 * @param {Object} req - O objeto de requisição do Express.
 * @param {Object} res - O objeto de resposta.
 * @return {Promise<void>} Uma promise que resolve para o usuário atualizado.
 */
const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token as string, req.body.senha);
  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * Envia um e-mail de verificação para um usuário.
 *
 * @param {Object} req - O objeto de requisição do Express.
 * @param {Object} res - O objeto de resposta.
 * @return {Promise<void>} Uma promise que resolve para o usuário atualizado.
 */
const sendVerificationEmail = catchAsync(async (req, res) => {
  const user = req.user as User;
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(user);
  await emailService.sendVerificationEmail(user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * Verifica um e-mail de verificação.
 *
 * @param {Object} req - O objeto de requisição do Express.
 * @param {Object} res - O objeto de resposta.
 * @return {Promise<void>} Uma promise que resolve para o usuário atualizado.
 */
const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token as string);
  res.status(httpStatus.NO_CONTENT).send();
});

export default {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail
};
