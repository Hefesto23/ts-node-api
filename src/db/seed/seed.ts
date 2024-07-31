import prisma from "@config/prisma"
import { criptografarSenha } from "@main/src/modules/users/services/password.service"

/**
 * @description Função que cria ou atualiza vários registros iniciais (seed) no banco de dados.
 * @return {Promise<void>}
 */
async function main() {
   await prisma.user.upsert({
    where: { email: 'viviane@prisma.io' },
    update: {},
    create: {
      email: 'viviane@prisma.io',
      nome: 'Viviane Furacão',
      cnpj: '11111111111111',
      senha: await criptografarSenha("uma-senha-teste-1"),
    },
  })
  await prisma.user.upsert({
    where: { email: 'caio@prisma.io' },
    update: {},
    create: {
      email: 'caio@prisma.io',
      nome: 'Caio Quebra Barraco',
      cnpj: '22222222222222',
      senha: await criptografarSenha("uma-senha-teste-2"),
    },
  })
   await prisma.user.upsert({
    where: { email: 'jaian@prisma.io' },
    update: {},
    create: {
      email: 'Jaian@prisma.io',
      nome: 'Jaian Luva de Predero',
      cnpj: '33333333333333',
      senha: await criptografarSenha("uma-senha-teste-3"),
    },
  })
  await prisma.user.upsert({
    where: { email: 'lucas@prisma.io' },
    update: {},
    create: {
      email: 'laian@prisma.io',
      nome: 'Lucas Lá Ele da Silva',
      cnpj: '44444444444444',
      senha: await criptografarSenha("uma-senha-teste-4"),
    },
  })
   await prisma.user.upsert({
    where: { email: 'joao@prisma.io' },
    update: {},
    create: {
      email: 'joao@prisma.io',
      nome: 'João Rei da Catuaba',
      cnpj: '55555555555555',
      senha: await criptografarSenha("uma-senha-teste-5"),
    },
  })
  await prisma.user.upsert({
    where: { email: 'gustavo@prisma.io' },
    update: {},
    create: {
      email: 'gustavo@prisma.io',
      nome: 'Gustavo Choaz Neguer Soares',
      cnpj: '66666666666666',
      senha: await criptografarSenha("uma-senha-teste-6"),
    },
  })

}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
