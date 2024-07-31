import { jwtStrategy } from '@config/passport';
import ApiError from '@shared/error/api.error';
import { errorConverter, errorHandler } from '@shared/error/middlewares.error';
import xss from '@shared/http/middlewares/xss';
import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import httpStatus from 'http-status';
import passport from 'passport';
import routes from './routes/index';

dotenv.config();

const app = express();

// Adiciona cabeçalhos de segurança para proteger o aplicativo contra ataques comuns
app.use(helmet());

// Compacta os dados enviados pelo servidor usando a compressão gzip
app.use(compression());

// Habilita o CORS (Cross-Origin Resource Sharing)
//para permitir solicitações de diferentes origens
app.use(cors());
 // Define as opções CORS para rotas aqui definidas
app.options('*', cors());

// Filtra os dados de solicitação para evitar ataques
// com o uso de injeção de código mal-intencionado
app.use(xss());

/**
 * O middleware express.urlencoded é responsável pela análise e conversão da string de uma solicitação em um objeto JavaScript.
 * No nosso caso, usamos o valor de extended como true para suportar a análise de arrays e objetos aninhados
 * que podem ser enviados em uma solicitação POST.
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Inicializa o Passport.js para autenticação JWT
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// Define as rotas do aplicativo
app.use('/api', routes);

// Envia um erro 404 para qualquer solicitação desconhecida
app.use((req, res, next) => {
  next(new ApiError('Recurso não encontrado!', httpStatus.NOT_FOUND));
});

// Converte erros para ApiError, se necessário
app.use(errorConverter);
app.use(errorHandler);

export default app;
