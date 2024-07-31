import swaggerAutogen from 'swagger-autogen';
import swaggerDef from './swagger-def';

// const doc = {
//   info: {
//     title: 'My API',
//     description: 'Description'
//   },
//   host: 'localhost:3000'
// };

const outputFile = 'src/shared/docs/swagger-output.json';
const routes = ['src/shared/http/routes/*.ts','src/modules/**/routes/*.ts'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen()(outputFile, routes, swaggerDef);
