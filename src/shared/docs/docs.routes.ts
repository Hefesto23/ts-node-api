import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerDefinition from './swagger-def';

const router = express.Router();

const specs = swaggerJsdoc({
  swaggerDefinition,
  apis: ['src/shared/docs/*.json',
    'src/shared/http/routes/*.ts',
    'src/modules/**/routes/*.ts',
  ]
});

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "REST API Docs Snapflow",
      version: "1.0.0"
    },
    components: {
      securitySchemas: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    securityDefinitions: {
      apiKeyAuth:{
          type: "apiKey",
          in: "header",
          name: "X-API-KEY",
      }
    },
  },
  apis: [
    'src/shared/docs/*.json',
    'src/shared/http/routes/*.ts',
    'src/modules/**/routes/*.ts',
  ]
}

const swaggerSpec = swaggerJsdoc(options)

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default router;
