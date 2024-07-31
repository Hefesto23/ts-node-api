/**
 * Função genérica para excluir chaves de um objeto.
 *
 * @param {Type} obj - O objeto do qual as chaves serão excluídas.
 * @param {string[]} keys - As chaves a serem excluídas do objeto.
 * @return {Omit<Type, Key>} - O objeto com as chaves especificadas excluídas.
 */
const exclude = <Type, Key extends keyof Type>(obj: Type, keys: Key[]): Omit<Type, Key> => {
  const newObject = { ...obj };
  for (const key of keys) {
    delete newObject[key];
  }
  return newObject
};

export default exclude;
