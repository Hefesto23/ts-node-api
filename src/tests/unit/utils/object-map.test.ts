import subObject from "@shared/utils/object-map";

describe('Utils: função de criação de subconjunto a partir de um objeto', () => {
  it('deve retornar um objeto vazio quando o objeto for indefinido "undefined"', () => {
    const result = subObject(undefined, ['key1', 'key2']);
    expect(result).toEqual({});
  });

  it('deve retornar um objeto vazio quando o objeto for nulo "null"', () => {
    const result = subObject(null, ['key1', 'key2']);
    expect(result).toEqual({});
  });

  it('deve retornar um objeto vazio quando o objeto for um objeto vazio "{}"', () => {
    const result = subObject({}, ['key1', 'key2']);
    expect(result).toEqual({});
  });

  it('deve retornar um objeto somente com as chaves selecionadas', () => {
    const obj = { key1: 'value1', key2: 'value2', key3: 'value3' };
    const result = subObject(obj, ['key1', 'key3']);
    expect(result).toEqual({ key1: 'value1', key3: 'value3' });
  });

  it('deve retornar um objeto somente com as chaves selecionadas ignorando as chaves inexistentes', () => {
    const obj = { key1: 'value1', key2: 'value2', key3: 'value3' };
    const result = subObject(obj, ['key1', 'key4']);
    expect(result).toEqual({ key1: 'value1' });
  });
});
