import config from '@config/config';
import logger from '@config/logger';
import prisma from '@config/prisma';
import { Server } from 'http';
import app from './app';

let server: Server;
prisma.$connect().then(() => {
  logger.info('Conectado ao Banco de Dados!');
  server = app.listen(config.port, () => {
    logger.info(`Servidor iniciado na porta ${config.port}`);
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Servidor foi encerrado');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: unknown) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM recebido para encerramento do servidor');
  if (server) {
    server.close();
  }
});
