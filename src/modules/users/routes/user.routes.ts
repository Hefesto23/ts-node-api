import { userController } from '@modules/users/controllers';
import { userValidation } from '@modules/users/validations';
import auth from '@shared/http/middlewares/auth';
import validate from '@shared/http/middlewares/validate';
import express from 'express';

const router = express.Router();
/**
 * @swagger
 * /api/users/editarUsuarios:
 *   post:
 *     summary: Edita um usuário pelo administrador
 *     tags:
 *       - user
 *     description: |
 *       Esse endpoint é usado por um administrador para editar dados de usuários.
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
 *                  description: A senha do usuário
 *                  example: 123456abc
 *               cnpj:
 *                  type: string
 *                  description: Uma série de 14 números que representa o CNPJ da empresa
 *                  example: exemplodecnpj!
 *     responses:
 *       '201':
 *         description: Usuário copiado com sucesso
 *       '400':
 *         description: Dados inválidos
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Administradores podem ler dados de usuários
 *     tags:
 *       - user
 *     description: |
 *       Esse endpoint é usado por administradores para filtrar usuários.
 *     parameters:
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *       - in: query
 *         name: cnpj
 *         schema:
 *           type: string
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: object
 *       - in: query
 *         name: take
 *         schema:
 *           type: string
 *       - in: query
 *         name: skip
 *         schema:
 *           type: number
 *     responses:
 *       '200':
 *         description: Dados filtrados com sucesso
 *       '400':
 *         description: Dados inválidos
 *     security:
 *       - bearerAuth: []
 */

router
  .route('/')
  .post(auth('editarUsuarios'), validate(userValidation.createUser), userController.createUser)
  .get(auth('lerUsuarios'), validate(userValidation.getUsers), userController.queryUsers);

/**
 * @swagger
 * /api/users/{userId}:
 *   get:
 *     summary: Lê os dados de um usuário
 *     tags:
 *       - user
 *     description: |
 *       Esse endpoint é usado para ler os dados de um usuário específico
 *     parameters:
 *      - in: path
 *        name: userId
 *        schema:
 *          type: string
 *        required: true
 *        description: Id do usuário
 *     responses:
 *       '200':
 *         description: Dados lidos com sucesso
 *       '404':
 *         description: Não encontrado
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /api/users/{userId}:
 *   patch:
 *     summary: Altera os dados de um usuário
 *     tags:
 *       - user
 *     description: |
 *       Esse endpoint é usado para alterar os dados de um usuário.
 *     parameters:
 *      - in: path
 *        name: userId
 *        schema:
 *          type: string
 *        required: true
 *        description: Id do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                  type: string
 *                  description: O novo nome do usuário
 *               email:
 *                  type: string
 *                  description: O novo email do usuário
 *                  example: newemail@example.com
 *     responses:
 *       '200':
 *         description: Usuário alterado com sucesso
 *       '400':
 *         description: Dados inválidos
 *       '404':
 *         description: Não encontrado
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /api/users/{userId}:
 *   delete:
 *     summary: Deleta um usuário
 *     tags:
 *       - user
 *     description: |
 *       Esse endpoint é usado para editar os dados de um usuário.
 *     parameters:
 *      - in: path
 *        name: userId
 *        schema:
 *          type: string
 *        required: true
 *        description: Id do usuário
 *     responses:
 *       '200':
 *         description: Usuário deletado com sucesso
 *       '404':
 *         description: Não encontrado
 *     security:
 *       - bearerAuth: []
 */

router
  .route('/:userId')
  .get(auth('lerUsuarios'), validate(userValidation.getUser), userController.getUser)
  .patch(auth('editarUsuarios'), validate(userValidation.updateUser), userController.updateUser)
  .delete(auth('editarUsuarios'), validate(userValidation.deleteUser), userController.deleteUser);

export default router;
