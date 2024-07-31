import { faker } from '@faker-js/faker';
import { Role, TokenType } from '@prisma/client';
import request from 'supertest';
import { gerarTokenTeste } from '../fixtures/token.fixtures';
import {
  admin,
  criarMultiUsuariosTestes,
  criarUsuarioTeste,
  user1,
  user2,
  user3,
  user4,
  user5,
  user6
} from '../fixtures/user.fixtures';
import { server, setupTest } from '../helpers/setupTest';

setupTest();
describe('Rotas de Usuários', () => {
  describe('GET /api/users', () => {
    it('Deve retornar uma lista de usuários', async () => {
      const adm = await criarUsuarioTeste(admin);
      // console.log(adm)
      const adminAccessToken = await gerarTokenTeste(adm.id, TokenType.ACCESS);
      // console.log(adminAccessToken)
      await criarMultiUsuariosTestes([user1, user2, user3, user4]);
      const res = await request(server)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminAccessToken}`);
      // console.log(res.body)
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(5);
      expect(res.body[0]).toHaveProperty('id');
      expect(res.body[0].nome).toBe(adm.nome);
      expect(res.body[0].email).toEqual(adm.email);
    });

    it('Deve retornar um erro (401 - Unauthorized) caso o usuário não possua token', async () => {
      const res = await request(server).get('/api/users');

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toBe('Usuário não autenticado!');
    });

    it('Deve retornar um erro (403 - Forbidden) caso o usuário não tenha privilégios de administrador', async () => {
      const user = await criarUsuarioTeste(user1);
      const userAccessToken = await gerarTokenTeste(user.id, TokenType.ACCESS)
      const res = await request(server)
        .get('/api/users')
        .set('Authorization', `Bearer ${userAccessToken}`);
      expect(res.statusCode).toEqual(403);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toBe('Sem permissão necessária(Forbidden)!');
    });

    it('Deve retornar uma lista somente com o usuário administrador', async () => {
      const user = await criarUsuarioTeste(admin);
      const adminAccessToken = await gerarTokenTeste(user.id, TokenType.ACCESS)
      const res = await request(server)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminAccessToken}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(1);
    });

    it('Deve aplicar o filtro de nome corretamente', async () => {
      const adm = await criarUsuarioTeste(admin);
      const adminAccessToken = await gerarTokenTeste(adm.id, TokenType.ACCESS);
      await criarMultiUsuariosTestes([user1, user2, user3]);

      const res = await request(server)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ nome: user1.nome });

      // console.log(res.body)
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].nome).toEqual("Macabeu Lima");
    });

    it('Deve aplicar o filtro de role corretamente', async () => {
      const adm = await criarUsuarioTeste(admin);
      const adminAccessToken = await gerarTokenTeste(adm.id, TokenType.ACCESS);
      await criarMultiUsuariosTestes([user1, user2, user3]);

      const res = await request(server)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ role: "user" });

      // console.log(res.body)
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(2);
    });

    it('Deve aplicar o filtro de email que termine em @snapflow.com', async () => {
      const adm = await criarUsuarioTeste(admin);
      const adminAccessToken = await gerarTokenTeste(adm.id, TokenType.ACCESS);
      await criarMultiUsuariosTestes([user1, user2, user4, user5]);

      const res = await request(server)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ email: { endsWith: "@snapflow.com"} });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(2);
    });

    it('Deve ordenar os usuários pelo nome em ordem crescente', async () => {
      const adm = await criarUsuarioTeste(admin);
      const adminAccessToken = await gerarTokenTeste(adm.id, TokenType.ACCESS);
      await criarMultiUsuariosTestes([user1, user2, user3]);

      const res = await request(server)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ orderBy:{ nome: 'asc' } });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(4);
      expect(res.body[0].nome).toBe("Admin da Silva SnapFlow");
      expect(res.body[1].nome).toBe("Caio Quebra Barraco");
      expect(res.body[2].nome).toBe("Macabeu Lima");
    });

    it('Deve retornar apenas 2 usuários', async () => {
      const adm = await criarUsuarioTeste(admin);
      const adminAccessToken = await gerarTokenTeste(adm.id, TokenType.ACCESS);
      await criarMultiUsuariosTestes([user1, user2, user3]);

      const res = await request(server)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ take: 2 });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(2);
    });

    it('Deve pular os primeiros 2 usuários', async () => {
      const adm = await criarUsuarioTeste(admin);
      const adminAccessToken = await gerarTokenTeste(adm.id, TokenType.ACCESS);
      await criarMultiUsuariosTestes([user1, user2, user3]);

      const res = await request(server)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ skip: 2 });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(2);
  });
});
  describe('POST /api/users', () => {
    it('Deve criar um novo usuário no banco de dados', async () => {
      const adm = await criarUsuarioTeste(admin);
      const adminAccessToken = await gerarTokenTeste(adm.id, TokenType.ACCESS);

      const res = await request(server)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(user1);

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.nome).toBe('Macabeu Lima');
      expect(res.body.email).toEqual('maca@example.com');
      expect(res.body.role).toBe(Role.USER);
    });

    it('Deve retornar erro (401 - Unauthorized) caso não tenha token', async () => {
      await request(server).post('/api/users').send(user1).expect(401);
    });

    it('Deve retornar erro (403 - Forbidden) se o usuário não tiver privilégios de acesso', async () => {
      const user = await criarUsuarioTeste(user1);
      const userOneAccessToken = await gerarTokenTeste(user.id, TokenType.ACCESS);

      await request(server)
        .post('/api/users')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(user2)
        .expect(403);
    });

    it('Deve retornar (400 - Bad Request) se o email é inválido', async () => {
      const adm = await criarUsuarioTeste(admin);
      const adminAccessToken = await gerarTokenTeste(adm.id, TokenType.ACCESS);

      const userNovo = Object.assign({}, user2);
      userNovo.email = 'emailInvalido';
      await request(server)
        .post('/api/users')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(userNovo)
        .expect(400);
    });

    it('Deve retornar (409 - Conflict) se o email já existir', async () => {
      const adm = await criarUsuarioTeste(admin);
      const adminAccessToken = await gerarTokenTeste(adm.id, TokenType.ACCESS);

      const userDois = await criarUsuarioTeste(user2);
      const userNovo = Object.assign({}, user3);
      userNovo.email = userDois.email;

      await request(server)
        .post('/api/users')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(userNovo)
        .expect(409);
    });

    it('Deve retornar (400 - Bad Request) se a senha não tiver pelo menos 6 caracteres', async () => {
      const adm = await criarUsuarioTeste(admin);
      const adminAccessToken = await gerarTokenTeste(adm.id, TokenType.ACCESS);

      const newUser = Object.assign({}, user3);
      newUser.senha = 'pwd1';

      await request(server)
        .post('/api/users')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newUser)
        .expect(400);
    });

    it('Deve retornar (400 - Bad Request) se a senha não tiver pelo menos 1 número e uma letra', async () => {
      const adm = await criarUsuarioTeste(admin);
      const adminAccessToken = await gerarTokenTeste(adm.id, TokenType.ACCESS);

      const newUser = Object.assign({}, user3);
      newUser.senha = 'novaSenha';

      await request(server)
        .post('/api/users')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newUser)
        .expect(400);

      newUser.senha = '1111111';

      await request(server)
        .post('/api/users')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newUser)
        .expect(400);
    });

  });

  describe('GET /api/users/:userId', () => {
    it('Deve retornar 200 e o perfil do usuário', async () => {
      const userOne = await criarUsuarioTeste(user1);
      const userOneAccessToken = await gerarTokenTeste(userOne.id, TokenType.ACCESS);
      // retorna o perfil do usuário mesmo sem privilégios de acesso
      // pq o usuário está tentando acessar o perfil próprio, de seu usuário.
      const res = await request(server)
        .get(`/api/users/${userOne.id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(200);

      // console.log(res.body)
      expect(res.body).not.toHaveProperty('senha');
      expect(res.body).toEqual({
        id: userOne.id,
        email: userOne.email,
        cnpj: userOne.cnpj,
        nome: userOne.nome,
        role: userOne.role,
        isEmailVerified: userOne.isEmailVerified,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('Deve retornar (401 - Unauthorized) se o usuário não estiver autenticado', async () => {
      const userOne = await criarUsuarioTeste(user1);

      await request(server).get(`/api/users/${userOne.id}`).send().expect(401);
    });

    it('Deve retornar (403 - Forbidden) se o usuário estiver tentando acessar um usuário que não é o seu', async () => {
      const userOne = await criarUsuarioTeste(user1);
      const userOneAccessToken = await gerarTokenTeste(userOne.id, TokenType.ACCESS);
      await criarMultiUsuariosTestes([user2, user3]);

      await request(server)
        .get(`/api/users/${user3.id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(403);
    });

    it('Deve retornar (200 - OK) se o admin estiver tentando acessar um usuário específico', async () => {
      const adm = await criarUsuarioTeste(admin);
      const adminAccessToken = await gerarTokenTeste(adm.id, TokenType.ACCESS);
      const userOne = await criarUsuarioTeste(user1);
      await request(server)
        .get(`/api/users/${userOne.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(200);
    });

    it('Deve retornar (400 - Bad Request) se o id do usuário é inválido', async () => {
      const adm = await criarUsuarioTeste(admin);
      const adminAccessToken = await gerarTokenTeste(adm.id, TokenType.ACCESS);

      const idInvalido = 'Jaboticaba';
      await request(server)
        .get(`/api/users/${idInvalido}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(400);
    });

    it('Deve retornar (404 - Not Found) se o usuário não existir', async () => {
      const adm = await criarUsuarioTeste(admin);
      const adminAccessToken = await gerarTokenTeste(adm.id, TokenType.ACCESS);

      await request(server)
        .get(`/api/users/${user6.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(404);
    });
  });

  describe('DELETE /api/users/:userId', () => {
    it('Deve retornar (200 - OK) e retornar o usuário deletado', async () => {
      const userOne = await criarUsuarioTeste(user1);
      const userOneAccessToken = await gerarTokenTeste(userOne.id, TokenType.ACCESS);

      const res = await request(server)
        .delete(`/api/users/${userOne.id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`);

      expect(res.body.nome).toBe(userOne.nome);
    });

    it('Deve retornar (401 - Unauthorized) se o usuário não estiver autenticado', async () => {
      const userOne = await criarUsuarioTeste(user1);

      await request(server)
        .delete(`/api/users/${userOne.id}`)
        .expect(401);
    });

    it('Deve retornar (403 - Forbidden) se o usuário estiver tentando deletar um usuário que não é o seu', async () => {
      const userOne = await criarUsuarioTeste(user1);
      const userOneAccessToken = await gerarTokenTeste(userOne.id, TokenType.ACCESS);

      const userDois = await criarUsuarioTeste(user2);
      await request(server)
        .delete(`/api/users/${userDois.id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(403);
    });

    it('Deve retornar (200 - OK) se o admin estiver tentando deletar um usuário', async () => {
      const adm = await criarUsuarioTeste(admin);
      const adminAccessToken = await gerarTokenTeste(adm.id, TokenType.ACCESS);
      const userOne = await criarUsuarioTeste(user1);

      await request(server)
        .delete(`/api/users/${userOne.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(200);
    });

    it('Deve retornar (400 - Bad Request) se o id do usuário é inválido', async () => {
      const adm = await criarUsuarioTeste(admin);
      const adminAccessToken = await gerarTokenTeste(adm.id, TokenType.ACCESS);

      await request(server)
        .delete('/api/users/idInvalido')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(400);
    });

    it('Deve retornar (404 - Not Found) se o usuário não existir', async () => {
      const adm = await criarUsuarioTeste(admin);
      const adminAccessToken = await gerarTokenTeste(adm.id, TokenType.ACCESS);

      await request(server)
        .delete(`/api/users/${user6.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(404);
    });
  });

  describe('PATCH /api/users/:userId', () => {
    it('Deve retornar (202 - Accepted) e retornar o usuário atualizado', async () => {
      const userOne = await criarUsuarioTeste(user1);
      const userOneAccessToken = await gerarTokenTeste(userOne.id, TokenType.ACCESS);

      const updateBody = {
        nome: faker.person.firstName(),
        email: faker.internet.email().toLowerCase(),
      };

      const res = await request(server)
        .patch(`/api/users/${userOne.id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(202);

      expect(res.body).not.toHaveProperty('senha');
      expect(res.body).toEqual({
        id: userOne.id,
        nome: updateBody.nome,
        email: updateBody.email,
        cnpj: userOne.cnpj,
        role: userOne.role,
        isEmailVerified: false,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('Deve retornar (401 - Unauthorized) se o usuário não estiver autenticado', async () => {
      const userOne = await criarUsuarioTeste(user1);
      const updateBody = { nome: faker.person.firstName() };

      await request(server)
        .patch(`/api/users/${userOne.id}`)
        .send(updateBody)
        .expect(401);
    });

    it('Deve retornar (403 - Forbidden) se o usuário estiver tentando atualizar um usuário que não é o seu', async () => {
      const userOne = await criarUsuarioTeste(user1);
      const userOneAccessToken = await gerarTokenTeste(userOne.id, TokenType.ACCESS);
      const userDois = await criarUsuarioTeste(user2);
      const updateBody = { nome: faker.person.firstName() };

      await request(server)
        .patch(`/api/users/${userDois.id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(403);
    });

    it('Deve retornar (202 - Accepted) se o admin estiver tentando atualizar outro usuário', async () => {
      const adm = await criarUsuarioTeste(admin);
      const adminAccessToken = await gerarTokenTeste(adm.id, TokenType.ACCESS);
      const userOne = await criarUsuarioTeste(user1);
      const updateBody = { nome: faker.person.firstName() };

      await request(server)
        .patch(`/api/users/${userOne.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(202);
    });

    it('Deve retornar (404 - Not Found) se o usuário não existir', async () => {
      const adm = await criarUsuarioTeste(admin);
      const adminAccessToken = await gerarTokenTeste(adm.id, TokenType.ACCESS);
      const updateBody = { nome: faker.person.firstName() };

      await request(server)
        .patch(`/api/users/${user6.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(404);
    });

    it('Deve retornar (400 - Bad Request) se o id do usuário é inválido', async () => {
      const adm = await criarUsuarioTeste(admin);
      const adminAccessToken = await gerarTokenTeste(adm.id, TokenType.ACCESS);
      const updateBody = { name: faker.person.firstName() };

      await request(server)
        .patch(`/api/users/invalidId`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(400);
    });

    it('Deve retornar (400 - Bad Request) se o email é inválido', async () => {
      const userOne = await criarUsuarioTeste(user1);
      const userOneAccessToken = await gerarTokenTeste(userOne.id, TokenType.ACCESS);
      const updateBody = { email: 'invalidEmail' };

      await request(server)
        .patch(`/api/users/${userOne.id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(400);
    });

    it('Deve retornar (400 - Bad Request) se o email ja existir', async () => {
      const userOne = await criarUsuarioTeste(user1);
      const userOneAccessToken = await gerarTokenTeste(userOne.id,TokenType.ACCESS);
      const userTwo = await criarUsuarioTeste(user2);
      const updateBody = { email: userTwo.email };

      await request(server)
        .patch(`/api/users/${userOne.id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(400);
    });

    it('Deve retornar (400 - Bad Request) se o email alterado para o mesmo email for do próprio usuário', async () => {
      const userOne = await criarUsuarioTeste(user1);
      const userOneAccessToken = await gerarTokenTeste(userOne.id, TokenType.ACCESS);
      const updateBody = { email: userOne.email };

      const res = await request(server)
        .patch(`/api/users/${userOne.id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(400);

      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toBe('Email já está cadastrado!');
    });
    it('Deve retornar (400 - Bad Request) se a senha possuir menos de 6 caracteres', async () => {
      const userOne = await criarUsuarioTeste(user1);
      const userOneAccessToken = await gerarTokenTeste(userOne.id, TokenType.ACCESS);
      const updateBody = { senha: 'pwo1' };

      await request(server)
        .patch(`/api/users/${userOne.id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(400);
    });

    it('Deve retornar (400 - Bad Request) se a senha não possuir ao menos 1 número e uma letra', async () => {
      const userOne = await criarUsuarioTeste(user1);
      const userOneAccessToken = await gerarTokenTeste(userOne.id, TokenType.ACCESS);
      const updateBody = { senha: 'password' };

      await request(server)
        .patch(`/api/users/${userOne.id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(400);

      updateBody.senha = '11111111';

      await request(server)
        .patch(`/api/users/${userOne.id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(400);
    });
  });
 })
