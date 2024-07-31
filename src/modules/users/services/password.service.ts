import bcrypt from 'bcrypt';

/**
 * Criptografa uma senha usando bcrypt.
 *
 * @param {string} senha - A senha a ser criptografada.
 * @return {Promise<string>} Uma promise que resolve com a senha criptografada.
 */
export const criptografarSenha = async (senha: string) => {
  return bcrypt.hash(senha, 8);
};

/**
 * Compara duas senhas para verificar se elas são iguais.
 *
 * @param {string} senha - A primeira senha a ser comparada.
 * @param {string} senhaUsuario - A segunda senha a ser comparada.
 * @return {Promise<boolean>} Uma promise que é resolvida com um booleano indicando se as senhas são iguais.
 */
export const comparadorDeSenhas = async (senha: string, senhaUsuario: string) => {
  return bcrypt.compare(senha, senhaUsuario);
};
