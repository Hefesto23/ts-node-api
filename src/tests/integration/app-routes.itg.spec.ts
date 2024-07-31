import request from 'supertest';
// import app from '../../shared/http/app';
import { server, setupTest } from '../helpers/setupTest';

setupTest();

//   (app as unknown as Server).close();
// }
// );
describe('App Routes', () => {
  it('Deve retornar mensagem "Ola, mundo!"',
  async () => {
    const res = await request(server).get('/api');

    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('Servidor em execução! Hello World!');
  });
});
