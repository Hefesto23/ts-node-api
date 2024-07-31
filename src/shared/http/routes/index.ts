import config from '@config/config';
import { authRoutes, userRoutes } from '@modules/users/routes';
import docsRoute from '@shared/docs/docs.routes';
import { Router } from 'express';

const routes = Router();
const defaultRoutes = [
  {
    path: '/auth',
    route: authRoutes
  },
  {
    path: '/users',
    route: userRoutes
  }
];

defaultRoutes.forEach((route) => {
  routes.use(route.path, route.route);
});

const devRoutes = [
  // rota de documentação (swagger)
  // rotas disponíveis apenas no ambiente de desenvolvimento
  {
    path: '/docs',
    route: docsRoute
  }
];

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    routes.use(route.path, route.route);
  });
}

/**
 * @openapi
 * /api:
 *   get:
 *     description: API HealthChecker
 *     responses:
 *       200:
 *         description: Retorna uma mensagem Hello World
 */
routes.use('/', (req, res) => {
  res.status(200).send('Servidor em execução! Hello World!');
});

export default routes;
