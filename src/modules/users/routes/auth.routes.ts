import { authController } from '@modules/users/controllers';
import authValidation from '@modules/users/validations/auth.validations';
import auth from '@shared/http/middlewares/auth';
import validate from '@shared/http/middlewares/validate';
import express from 'express';

const router = express.Router();

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Registra um usuário
 *     tags:
 *       - user
 *     description: |
 *       Esse endpoint é usado para registrar um usuário.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              - email
 *              - senha
 *              - cnpj
 *             properties:
 *               email: 
 *                  type: string
 *                  description: O email do usuário
 *                  example: user@example.com
 *               nome:
 *                  type: string
 *                  description: O nome do usuário
 *               senha:
 *                  type: string
 *                  description: The user password
 *                  example: 123456abc
 *               cnpj:
 *                  type: string
 *                  description: Uma série de 14 números que representa o CNPJ da empresa
 *                  example: exemplodecnpj!
 *     responses:
 *       '201':
 *         description: Usuário criado com sucesso
 *       '400':
 *         description: Dados inválidos
 *     security:
 *       - bearerAuth: []
 */

router.post('/register', validate(authValidation.register), authController.register);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Autentica um usuário
 *     tags:
 *       - auth
 *     description: |
 *       Esse endpoint é usado para autenticar usuários na aplicação.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              - email
 *              - senha
 *             properties:
 *               email: 
 *                  type: string
 *                  description: O email do usuário
 *                  example: user@example.com
 *               senha:
 *                  type: string
 *                  description: A senha do usuário
 *                  example: 123456abc
 *     responses:
 *       '200':
 *         description: Usuário autenticado com sucesso
 *       '400':
 *         description: Dados inválidos
 */

router.post('/login', validate(authValidation.login), authController.login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Desconecta um usuário autenticado.
 *     tags:
 *       - auth
 *     description: |
 *       Esse endpoint é usado para desconectar um usuário autenticado na aplicação.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              - refreshToken
 *             properties:
 *               refreshToken: 
 *                  type: string
 *                  description: O refreshToken do usuário
 *     responses:
 *       '204':
 *         description: Sem conteúdo
 *       '404':
 *         description: Não localizado
 *     security:
 *       - bearerAuth: []
 */

router.post('/logout', validate(authValidation.logout), authController.logout);

/**
 * @swagger
 * /api/auth/refresh-tokens:
 *   post:
 *     summary: Atualizar um token
 *     tags:
 *       - auth
 *     description: |
 *       Esse endpoint é usado para atualizar um token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              - refreshToken
 *             properties:
 *               refreshToken: 
 *                  type: string
 *                  description: O refreshToken do usuário
 *     responses:
 *       '200':
 *         description: RefreshToken atualizado com sucesso
 *       '400':
 *         description: Dados inválidos
 *     security:
 *       - bearerAuth: []
 */

router.post(
  '/refresh-tokens',
  validate(authValidation.refreshTokens),
  authController.refreshTokens
);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Solicita uma nova senha
 *     tags:
 *       - auth
 *     description: |
 *       Esse endpoint é usado para solicitar uma nova senha.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              - email
 *             properties:
 *               email: 
 *                  type: string
 *                  description: O email do usuário
 *                  example: user@example.com
 *     responses:
 *       '204':
 *         description: Sem conteúdo
 *       '400':
 *         description: Dados inválidos
 *       '401':
 *         description: Não autorizado
 */

router.post(
  '/forgot-password',
  validate(authValidation.forgotPassword),
  authController.forgotPassword
);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Redefine a senha de um usuário
 *     tags:
 *       - auth
 *     description: |
 *       Esse endpoint é usado para redefinir a senha de um usuário.
 *     parameters:
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         required:
 *           - token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              - senha
 *             properties:
 *               senha:
 *                  type: string
 *                  description: A nova senha do usuário
 *                  example: newpassword123
 *     responses:
 *       '204':
 *         description: Sem conteúdo
 *       '400':
 *         description: Dados inválidos
 *       '401':
 *         description: Não autorizado
 */

router.post(
  '/reset-password',
  validate(authValidation.resetPassword),
  authController.resetPassword
);

/**
 * @swagger
 * /api/auth/send-verification-email:
 *   post:
 *     summary: Envia um email de verificação
 *     tags:
 *       - auth
 *     description: |
 *       Esse endpoint é usado para verificar um email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              - user
 *             properties:
 *               user: 
 *                  type: object
 *                  required:
 *                    - id
 *                    - email
 *                  properties:
 *                    id:
 *                      type: string
 *                    email:
 *                      type: string
 *                      example: user@example.com
 *     responses:
 *       '204':
 *         description: Sem conteúdo
 *       '400':
 *         description: Dados inválidos
 *       '401':
 *         description: Nâo autorizado
 *     security:
 *       - bearerAuth: []
 */
router.post('/send-verification-email', auth(), authController.sendVerificationEmail);

/**
 * @swagger
 * /api/auth/verify-email:
 *   post:
 *     summary: Verifica o email de um usuário
 *     tags:
 *       - auth
 *     description: |
 *       Esse endpoint verifica o email de um usuário.
 *     parameters:
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         required:
 *           - token
 *     responses:
 *       '200':
 *         description: Email verificado com sucesso
 *       '401':
 *         description: Não autorizado
 */
router.post('/verify-email', validate(authValidation.verifyEmail), authController.verifyEmail);

export default router;

