import { Role, TokenType } from '@prisma/client';
import request from 'supertest';
import { comparadorDeSenha, retornaToken, userAuth1, userAuth2, userAuth3, userAuth4 } from '../fixtures/auth.fixtures';
import { contadorDeTokens, gerarTokenExpirado, gerarTokenSemDB, gerarTokenTeste } from '../fixtures/token.fixtures';
import { criarUsuarioTeste, retornaUserPeloId } from '../fixtures/user.fixtures';
import { server, setupTest } from '../helpers/setupTest';
// import { emailService, tokenService } from '@modules/users/services';

setupTest();
describe('Rotas de Autenticação', () => {
  describe('POST /api/auth/register', () => {

    it('Deve retornar (201 - Created) com os dados do usuário criado e seus tokens', async () => {
      const res = await request(server)
        .post('/api/auth/register')
        .send(userAuth2)
        .expect(201);

      // console.log(res.body);
      expect(res.body.user).not.toHaveProperty('senha');
      expect(res.body.user).toEqual({
        id: expect.anything(),
        nome: userAuth2.nome,
        cnpj: userAuth2.cnpj,
        email: userAuth2.email,
        role: Role.USER,
        isEmailVerified: false
      });

      expect(res.body.tokens).toEqual({
        access: { token: expect.anything(), expires: expect.anything() },
        refresh: { token: expect.anything(), expires: expect.anything() }
      });
    });

    it('Deve retornar (400 - Bad Request) caso o email seja inválido', async () => {
      await request(server).post('/api/auth/register')
      .send(userAuth3).expect(400);
    });

    it('Deve retornar (400 - Bad Request) caso já esteja cadastrado', async () => {
      const user1 = await criarUsuarioTeste(userAuth1);
      userAuth3.email = user1.email;

      await request(server)
        .post('/api/auth/register')
        .send(userAuth3)
        .expect(400);
    });

    it('Deve retornar (400 - Bad Request) caso a senha possua menos de 6 caracteres', async () => {
      userAuth4.senha = 'pss1';

      await request(server)
        .post('/api/auth/register')
        .send(userAuth4)
        .expect(400);
    });

    it('Deve retornar (400 - Bad Request) caso a senha possua só letras ou só números', async () => {
      userAuth4.senha = 'password';

      await request(server)
        .post('/api/auth/register')
        .send(userAuth4)
        .expect(400);

      userAuth4.senha = '11111111';

      await request(server)
        .post('/api/auth/register')
        .send(userAuth4)
        .expect(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('Deve retornar (200 - OK) realizando o login de um usuário', async () => {
      const userOne = await criarUsuarioTeste(userAuth1);
      const loginCredentials = {
        email: userOne.email,
        senha: userAuth1.senha
      };

      const res = await request(server)
        .post('/api/auth/login')
        .send(loginCredentials)
        .expect(200);

      // console.log(res.body);
      expect(res.body.user).toMatchObject({
        id: expect.anything(),
        nome: userOne.nome,
        email: userOne.email,
        role: "USER",
        isEmailVerified: userOne.isEmailVerified
      });

      expect(res.body.user)
        .toEqual(expect.not.objectContaining({ senha: expect.anything() }));

      expect(res.body.tokens).toEqual({
        access: { token: expect.anything(), expires: expect.anything() },
        refresh: { token: expect.anything(), expires: expect.anything() }
      });
    });

    it('Deve retornar (401 - Unauthorized) caso o usuário não esteja registrado', async () => {
      const loginCredentials = {
        email: userAuth1.email,
        senha: userAuth1.senha
      };

      const res = await request(server)
        .post('/api/auth/login')
        .send(loginCredentials)
        .expect(400);

      expect(res.body).toEqual({
        code: 400,
        message: 'Email ou senha inválidos'
      });
    });

    it('Deve retornar (401 - Unauthorized) caso a senha seja inválida', async () => {
     const userOne = await criarUsuarioTeste(userAuth1);
      const loginCredentials = {
        email: userOne.email,
        senha: 'senhaIncorreta'
      };

      const res = await request(server)
        .post('/api/auth/login')
        .send(loginCredentials)
        .expect(400);

      expect(res.body).toEqual({
        code: 400,
        message: 'Email ou senha inválidos'
      });
    });
  });

  describe('POST /api/auth/logout', () => {
    it('Deve retornar (204 - No Content) se o refresh token estiver correto', async () => {
      const userOne = await criarUsuarioTeste(userAuth1);
      const loginCredentials = {
        email: userOne.email,
        senha: userAuth1.senha
      };

      const res1 = await request(server)
        .post('/api/auth/login')
        .send(loginCredentials)

      const { refresh } = res1.body.tokens;
      const refreshToken = refresh.token;

      await request(server)
        .post('/api/auth/logout')
        .send({ refreshToken })
        .expect(204);

      const dbRefreshToken = await retornaToken(refreshToken)
      expect(dbRefreshToken).toBe(null);
    });

    it('Deve retornar (400 - Bad Request) se o body estiver vazio', async () => {
      await request(server)
        .post('/api/auth/logout')
        .expect(400);
    });

    it('Deve retornar (404 - Not Found) se o refresh token não estiver salvo no Banco de Dados', async () => {
      const user1 = await criarUsuarioTeste(userAuth1);
      const refreshToken = await gerarTokenSemDB(user1.id, TokenType.REFRESH);
      await request(server)
        .post('/api/auth/logout')
        .send({ refreshToken })
        .expect(404);
    });

    it('Deve retornar (404 - Not Found) se o token estiver "blacklisted"', async () => {
      const user1 = await criarUsuarioTeste(userAuth1);
      const refreshToken = await gerarTokenTeste(user1.id, TokenType.REFRESH,true);

      await request(server)
        .post('/api/auth/logout')
        .send({ refreshToken })
        .expect(404);
    });
  });

  describe('POST /api/auth/refresh-tokens', () => {
    it('Deve retornar (200 - OK) se o refresh token estiver correto', async () => {
      const user1 = await criarUsuarioTeste(userAuth1);
      const refreshToken = await gerarTokenTeste(user1.id, TokenType.REFRESH);

      const res = await request(server)
        .post('/api/auth/refresh-tokens')
        .send({ refreshToken })
        .expect(200);

      expect(res.body).toEqual({
        access: { token: expect.anything(), expires: expect.anything() },
        refresh: { token: expect.anything(), expires: expect.anything() }
      });
    });

    it('Deve retornar (400 - Bad Request) se o body estiver vazio', async () => {
      await request(server)
        .post('/api/auth/refresh-tokens')
        .expect(400);
    });

    it('Deve retornar (401 - Unauthorized) se o refresh token tiver um segredo inválido', async () => {
      const user1 = await criarUsuarioTeste(userAuth1);
      const refreshToken = await gerarTokenTeste(user1.id, TokenType.REFRESH, false,'tokenInvalido');

      await request(server)
        .post('/api/auth/refresh-tokens')
        .send({ refreshToken })
        .expect(401);
    });

    it('Deve retornar (401 - Unauthorized) se o refresh token não estiver salvo no Banco de Dados', async () => {
      const user1 = await criarUsuarioTeste(userAuth1);
      const refreshToken = await gerarTokenSemDB(user1.id, TokenType.REFRESH);

      await request(server)
        .post('/api/auth/refresh-tokens')
        .send({ refreshToken })
        .expect(401);
    });

    it('Deve retornar (401 - Unauthorized) se o refresh token estiver "blacklisted"', async () => {
      const user1 = await criarUsuarioTeste(userAuth1);
      const refreshToken = await gerarTokenTeste(user1.id, TokenType.REFRESH, true);

      await request(server)
        .post('/api/auth/refresh-tokens')
        .send({ refreshToken })
        .expect(401);
    });

    it('Deve retornar (401 - Unauthorized) se o refresh token estiver expirado', async () => {
      const user1 = await criarUsuarioTeste(userAuth1);
      const refreshToken = await gerarTokenExpirado(user1.id, TokenType.REFRESH);

      await request(server)
        .post('/api/auth/refresh-tokens')
        .send({ refreshToken })
        .expect(401);
    });
  });

  describe('POST /api/auth/forgot-password', () => {

    it('Deve retornar (204 - No Content) se o email estiver correto', async () => {
      const user1 = await criarUsuarioTeste(userAuth1);
      // const refreshToken = await gerarTokenExpirado(user1.id, TokenType.REFRESH);

      const res = await request(server)
        .post('/api/auth/forgot-password')
        .send({ email: user1.email })
        .expect(204);

    });

    it('Deve retornar (400 - Bad Request) se o body estiver vazio', async () => {
      await criarUsuarioTeste(userAuth1);

      await request(server)
              .post('/api/auth/forgot-password')
              .send({})
              .expect(400);
    });

    it('Deve retornar (404 - Not Found) se o email estiver incorreto', async () => {
      await request(server)
        .post('/api/auth/forgot-password')
        .send({ email: userAuth2.email })
        .expect(404);
    });
  });


  describe('POST /api/auth/reset-password', () => {
    it('Deve retornar (204 - No Content) se o reset password token estiver correto', async () => {
      const user1 = await criarUsuarioTeste(userAuth1);
      const resetPasswordToken = await gerarTokenTeste(user1.id, TokenType.RESET_PASSWORD);
      await request(server)
        .post('/api/auth/reset-password')
        .query({ token: resetPasswordToken })
        .send({ senha: 'password2' })
        .expect(204);

      const userUpdated = await retornaUserPeloId(user1.id);
      const senha = userUpdated?.senha || '';
      const isPasswordMatch = await comparadorDeSenha('password2', senha);
      expect(isPasswordMatch).toBe(true);

      const contadorDeResetPasswordTokens = await contadorDeTokens(user1.id,TokenType.RESET_PASSWORD);
      expect(contadorDeResetPasswordTokens).toBe(0);
    });

    it('Deve retornar (400 - Bad Request) se o token não for enviado', async () => {
     await criarUsuarioTeste(userAuth1);

      await request(server)
        .post('/api/auth/reset-password')
        .send({ senha: 'password2' })
        .expect(400);
    });

    it('Deve retornar (401 - Unauthorized) se o reset password token estiver "blacklisted"', async () => {
      const user1 = await criarUsuarioTeste(userAuth1);
      const resetPasswordTokenBlacklisted = await gerarTokenTeste(user1.id, TokenType.RESET_PASSWORD, true);

      await request(server)
        .post('/api/auth/reset-password')
        .query({ token: resetPasswordTokenBlacklisted })
        .send({ senha: 'password2' })
        .expect(401);
    });

    it('Deve retornar (401 - Unauthorized) se o reset password token estiver expirado', async () => {
      const user1 = await criarUsuarioTeste(userAuth1);
      const resetPasswordTokenExpired = await gerarTokenExpirado(user1.id, TokenType.RESET_PASSWORD);

      await request(server)
        .post('/api/auth/reset-password')
        .query({ token: resetPasswordTokenExpired })
        .send({ senha: 'password2' })
        .expect(401);
    });

    it('Deve retornar (401 - Unauthorized) se o usuário não estiver cadastrado', async () => {
      const resetPasswordToken = await gerarTokenSemDB(userAuth4.id, TokenType.RESET_PASSWORD);

      await request(server)
        .post('/api/auth/reset-password')
        .query({ token: resetPasswordToken })
        .send({ senha: 'password2' })
        .expect(401);
    });

    it('Deve retornar (400 - Bad Request) se estiver faltando a senha ou ela estiver inválida', async () => {
      const user1 = await criarUsuarioTeste(userAuth1);
      const resetPasswordToken = await gerarTokenTeste(user1.id, TokenType.RESET_PASSWORD);

      await request(server)
        .post('/api/auth/reset-password')
        .query({ token: resetPasswordToken })
        .expect(400);

      await request(server)
        .post('/api/auth/reset-password')
        .query({ token: resetPasswordToken })
        .send({ senha: 'pwd1' })
        .expect(400);

      await request(server)
        .post('/api/auth/reset-password')
        .query({ token: resetPasswordToken })
        .send({ senha: '11111111' })
        .expect(400);
    });
  });
});
