import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { authToken } from '../middlewares/authToken.middleware.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.middleware.js';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TecGPT API',
      version: '1.0.0',
      description: 'Documentación de la API de TecGPT',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor local',
      },
    ],
  },
  apis: [
    './src/routes/*.js', // Puedes documentar tus endpoints aquí con comentarios Swagger
    './src/controllers/*.js',
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app) {
  app.use('/api-docs',[authToken, authorizeRoles], swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}