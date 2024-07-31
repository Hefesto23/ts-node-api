import Joi from 'joi';
import { password } from './password.validations';

const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    nome: Joi.string().optional(),
    cnpj: Joi.string().required().length(14),
    senha: Joi.string().required().custom(password)
  })
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    senha: Joi.string().required()
  })
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required()
  })
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required()
  })
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().required()
  })
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required()
  }),
  body: Joi.object().keys({
    senha: Joi.string().required().custom(password)
  })
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required()
  })
};

export default {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail
};
