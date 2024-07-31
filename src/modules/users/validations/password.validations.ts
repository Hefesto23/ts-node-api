import Joi from 'joi';

export const password: Joi.CustomValidator<string> = (value, helpers) => {
  if (value.length < 6) {
    return helpers.error('Senha deve ter pelo menos 6 caracteres');
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.error('Senha deve ter pelo menos uma letra e um número');
  }
  return value;
};
