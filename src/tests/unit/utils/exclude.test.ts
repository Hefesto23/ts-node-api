import exclude from '@shared/utils/exclude';

describe('Utils: função exclude ', () => {
  it('deve excluir chaves passadas no parâmetro da função exclude', () => {
    const obj = {
      nome: 'João',
      idade: 30,
      endereço: 'Ruas das Rosas, 123',
    };

    const result = exclude(obj, ['endereço', 'idade']);
    expect(obj).not.toEqual(result);
    expect(result).toEqual({ nome: 'João' });
  });

  it('deve retornar o objeto original caso as chaves passadas sejam inexistentes', () => {
    const obj = {
      nome: 'Alice',
      idade: 25,
    };

    const result = exclude(obj, []);

    expect(result).toEqual({ nome: 'Alice', idade: 25 });
  });

  it('deve retornar objeto vazio caso o objeto original seja vazio', () => {
    const obj = {};

    const result = exclude(obj, []);

    expect(result).toEqual({});
  });
});
