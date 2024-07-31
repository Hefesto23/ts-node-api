/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from '@config/prisma';
import { Prisma, User } from '@prisma/client';
import { ICreateUserRequest } from '../interfaces';
import { Key } from '../types';

interface IUserRepo {
  create: ({ nome, cnpj, email }: ICreateUserRequest) => Promise<User>,
  findByEmail: (email: string, select: object) => Promise<Pick<User, Key> | null>,
  findByCNPJ: (cnpj: string) => Promise<User | null>,
  findById: (id: string, select: object) => Promise<Pick<User, Key> | null>,
  findOneBy(field: string, value: any): Promise<User | null>,
  existsByField(field: string, value: any): Promise<boolean>,
  findManyBy(field: string, value: any): Promise<User[] | null>,
  findAll: () => Promise<User[]>,
  update: (id: string, data: Prisma.UserUpdateInput, select: object) => Promise<Pick<User, Key> | null>,
  delete: (id: string) => Promise<User>,
}

class UserRepo implements IUserRepo {

    /**
     * Cria um usuário no sistema
     * @param param0 {nome, cnpj, email, senha, role}
     * @returns Promise<User> o usuário criado
     */
    create = async ({ nome, cnpj, email, senha, role }: ICreateUserRequest): Promise<User> => {
        return prisma.user.create({
          data: {
            nome,
            email,
            cnpj,
            senha,
            role
          }
        })
    }

    /**
    * Pesquisa por usuário pelo campo e valor passado na função
    * @param field [string] o nome do campo
    * @param value [any] o valor do campo
    * @returns {Promise<Pick<User, Key> | null>} user
    */
    findOneBy = async (field: string, value: any): Promise<User | null> => {
        return prisma.user.findFirst({
            where: { [field]: value }
        })
    }

    /**
     * @description Checa se usuário que possua campo e valor passado na função existe
     * @param field [string] o nome do campo
     * @param value [any] o valor do campo
     * @returns {Promise<boolean>} true ou false
     */
    existsByField = async (field: string, value: any): Promise<boolean> => {
        const user = await prisma.user.findFirst({
            where: { [field]: value }
        })
        // Converte em boolean (true ou false)
        return !!user;
    }

    /**
     * Pesquisa por usuário pelo email
     * @param {string} email email do usuário
     * @param {object} select select campos ou 'fields' específicos a serem retornados
     * @returns {Promise<Pick<User, Key> | null>} user
     */
    findByEmail = async (email: string, select: object): Promise<Pick<User, Key> | null> => {
      return prisma.user.findUnique({
            where: { email },
            select
        }) as Promise<Pick<User, Key> | null>;
    }

    /**
     * Pesquisa por usuário por CNPJ
     * @param {string} cnpj cnpj do usuário
     * @returns {Promise<User | null>} user
     */
    findByCNPJ = async (cnpj: string): Promise<User | null> => {
      return prisma.user.findUnique({
            where: { cnpj }
        })
    }

    /**
     * Pesquisa por usuário por ID
     * @param {string} id id do usuário
     * @param {object} select select campos ou 'fields' específicos a serem retornados
     * @returns {Promise<User | null>} user
     */
    findById = async (id: string, select: object):  Promise<Pick<User, Key> | null> => {
      return prisma.user.findUnique({
            where: { id },
            select,
        }) as Promise<Pick<User, Key> | null>;
    }

    /**
     * Retorna todos os usuários
     * @returns {Promise<User[]>}
     */
    findAll = async (): Promise<User[]> => {
      return prisma.user.findMany();
    }

    /**
     * Pesquisar usuários por campo e valor
     * @param field [string] o nome do campo
     * @param value [any] o valor do campo
     * @returns {Promise<User[] | null>} usuários encontrados
     */
    findManyBy = async (field: string, value: any): Promise<User[] | null> => {
      return prisma.user.findMany({
        where: { [field]: value }
      })
    }

    /**
     * Consulta de usuários
     * @param {object} where condições de busca
     * @param {object} options paginação e ordenação
     * @param {object} select campos ou 'fields' específicos a serem retornados
     * @returns {Promise<Pick<User, Key>[]>}
     */
    queryUsers = async <Key extends keyof User>(
      where: object,
      options: {
        take?: number;
        skip?: number;
        orderBy?: object;
      },
      select: object
    ): Promise<Pick<User, Key>[]> => {

      const findManyParams = {
        select,
        ...options
      };
      if(Object.keys(where).length) {
        Object.assign(findManyParams, { where: where })
      }
      const users = await prisma.user.findMany(findManyParams);
      return users as Pick<User, Key>[];
    };

    /**
     * Atualiza um usuário
     * @param {string} id id do usuário
     * @param {Prisma.UserUpdateInput} updateBody dados do usuário a serem atualizados
     * @param {object} select campos ou 'fields' específicos a serem retornados
     * @returns {Promise<Pick<User, Key> | null>}
     */
    update = async (id: string, updateBody: Prisma.UserUpdateInput, select: object): Promise<Pick<User, Key> | null> => {
      return await prisma.user.update({
        where: { id },
        data: updateBody,
        select
      }) as Pick<User, Key> | null;
    }

    /**
     * Deleta um usuário pelo ID
     * @param {string} id id do usuário
     * @returns {Promise<User>}
     */
    delete = async (id: string): Promise<User> => {
      return prisma.user.delete({
        where: { id: id },
      });
    }

  }

export { IUserRepo, UserRepo };

