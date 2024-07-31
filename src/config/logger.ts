import winston from 'winston';
import config from './config';

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

/**
 * Cria um objeto logger utilizando o winston.
 * O nível de log é definido pelo ambiente de execução.
 * No desenvolvimento, o nível é definido como debug, enquanto que em produção é definido como info.
 * O logger é configurado para imprimir no console.
 * @returns {winston.Logger} - O objeto logger criado.
 */
const logger = winston.createLogger({
  level: config.env === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    enumerateErrorFormat(),
    config.env === 'development' ? winston.format.colorize() : winston.format.uncolorize(),
    winston.format.splat(),
    winston.format.printf(({ level, message }) => `${level}: ${message}`)
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ['error']
    })
  ]
});

export default logger;
