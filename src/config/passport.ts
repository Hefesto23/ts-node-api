import prisma from '@config/prisma';
import { TokenType } from '@prisma/client';
import { ExtractJwt, Strategy as JwtStrategy, VerifyCallback } from 'passport-jwt';
import config from './config';

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

/**
 * Verifica assincronamente o payload do JWT e chama o callback done com o usuário se o token for válido.
 *
 * @param {any} payload - O payload do JWT a ser verificado.
 * @param {any} done - O callback a ser chamado ao término da verificação.
 * @return {void} Executa o callback done com um erro ou o usuário verificado.
 */
const jwtVerify: VerifyCallback = async (payload: any, done: any) => {
  try {
    if (payload.type !== TokenType.ACCESS) {
      throw new Error('Tipo de token inválido');
    }
    const user = await prisma.user.findUnique({
      select: {
        id: true,
        email: true,
        nome: true,
        role: true
      },
      where: { id: payload.sub }
    });
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

export const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);
