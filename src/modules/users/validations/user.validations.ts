import { Role } from '@prisma/client';
import Joi from 'joi';
import { password } from './password.validations';

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    senha: Joi.string().required().custom(password),
    cnpj: Joi.string().required().length(14),
    nome: Joi.string().optional(),
    role: Joi.string().valid(...Object.values(Role)).optional()
  })
};

const getUsers = {
  query: Joi.object().keys({
    nome: Joi.alternatives().try(Joi.string(), Joi.object()).optional(),
    role: Joi.string().uppercase().optional(),
    email: Joi.alternatives().try(Joi.string(), Joi.object()).optional(),
    cnpj: Joi.alternatives().try(Joi.string(), Joi.object()).optional(),
    orderBy: Joi.object().optional(),
    take: Joi.number().integer().optional(),
    skip: Joi.number().integer().optional()
  })
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().uuid()
  })
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.string().uuid()
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email().optional(),
      senha: Joi.string().custom(password).optional(),
      nome: Joi.string().optional(),
      cnpj: Joi.string().length(14).optional(),
      role: Joi.string().optional()
    })
    .min(1)
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().uuid()
  })
};

export default {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser
};
