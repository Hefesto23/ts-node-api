import config from '@config/config';
import { PrismaClient } from '@prisma/client';

// Adiciona o tipo prisma ao global do nodejs
interface CustomNodeJsGlobal extends Global {
  prisma: PrismaClient;
}

// Previne múltiplas instâncias de inicialização do Prisma
declare const global: CustomNodeJsGlobal;

const prisma = global.prisma || new PrismaClient();

if (config.env === 'development') global.prisma = prisma;

export default prisma;
