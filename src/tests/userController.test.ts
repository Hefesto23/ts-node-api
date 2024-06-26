import request from 'supertest';
import app from '../app';

// Mock do serviço de usuário
jest.mock('../services/userService', () => ({
  getAllUsers: jest.fn().mockResolvedValue([{ name: 'John Doe' }])
}));

describe('GET /api/users', () => {
  it('deve retornar todos os usuários', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('length', 1);
    expect(res.body[0]).toHaveProperty('name', 'John Doe');
  });
});
