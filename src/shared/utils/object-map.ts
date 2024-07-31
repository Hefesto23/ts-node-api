/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Cria um objeto composto pelo subconjunto das propriedades do objeto.
 * @param {Object} objeto
 * @param {string[]} chaves
 * @returns {Object}
 */
const subObject = (objeto: any, chaves: string[]) => {
  return chaves.reduce((obj: any, chave: string) => {
    if (objeto && Object.prototype.hasOwnProperty.call(objeto, chave)) {
      // eslint-disable-next-line no-param-reassign
      obj[chave] = objeto[chave];
    }
    return obj;
  }, {});
};

export default subObject;
