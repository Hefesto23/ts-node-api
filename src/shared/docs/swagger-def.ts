import config from '@config/config';
import { name, repository, version } from '@main/package.json';

const swaggerDef = {
  openapi: '3.0.0',
  schemes: ['http', 'https'],
  info: {
    title: `${name} documentação da API`,
    version,
    license: {
      name: 'MIT',
      url: repository
    }
  },
  host: "localhost:3000",
  basePath: "/api",
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    {
        "name": "user",
        "description": "Endpoints"
    }
],
securityDefinitions: {
  apiKeyAuth:{
      type: "apiKey",
      in: "header",       // can be "header", "query" or "cookie"
      name: "X-API-KEY",  // name of the header, query parameter or cookie
      description: "any description..."
  }
},
  // servers: [
  //   {
  //     url: `http://localhost:${config.port}/api`
  //   }
  // ]
};

export default swaggerDef;
