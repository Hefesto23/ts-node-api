# Snapflow CRM

Snapflow CRM é uma aplicação SaaS construída com Node.js, TypeScript e Express. Ele é responsável por gerenciar clientes, vendas e outras funcionalidades relacionadas ao CRM.

## Antes de começar - Dependências

### Node.js
Para executar este projeto, você precisa ter o Node.js instalado em seu sistema. Recomendamos a utilização do Node Version Manager (nvm) para gerenciar as versões do Node.js. Para instalar o nvm, siga as instruções no site oficial: https://github.com/nvm-sh/nvm

Após a instalação do nvm, você pode instalar a versão exigida do Node.js neste projeto a versão 18.20 executando o seguinte comando:

```bash
nvm install 18.20.3
```

### npm
O npm versão 10.8

```bash
npm install -g npm@10.8.1
```

### pnpm
O pnpm versão 9.4

```bash
npm install -g pnpm@9.4.0
```

### Docker
#### Windows
Faça o download e instale o Docker Desktop a partir do site oficial: https://www.docker.com/products/docker-desktop
Siga o assistente de instalação para concluir a instalação.
Após a conclusão da instalação, o Docker Desktop será iniciado automaticamente.

#### Linux
Adicione o repositório do Docker ao seu sistema:

```bash
sudo apt-get update
sudo apt-get install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
```
Instale o Docker CE:

```bash
sudo apt-get update
sudo apt-get install docker-ce
```
Inicie o serviço do Docker:

```bash
sudo systemctl start docker
```

#### macOS

Faça o download e instale o Docker Desktop a partir do site oficial: https://www.docker.com/products/docker-desktop
Siga o assistente de instalação para concluir a instalação.
Após a conclusão da instalação, o Docker Desktop será iniciado automaticamente.
Observe que o Docker Desktop requer uma versão do macOS de 10.14 ou superior para ser executado.

## Instalação

Para instalar o Snapflow CRM, siga estas etapas:

1. Certifique-se de ter o Node.js e o pnpm instalados em seu sistema.
2. Clone este repositório usando o comando `git clone`. ex: `git clone https://gitlab.com/snapflow/backend/autenticacao.git`
3. Navegue até o diretório do projeto usando o comando `cd`.
4. Execute o comando `pnpm install` ou `pnpm i` para instalar as dependências do projeto.
5. Configure as variáveis de ambiente necessárias, como credenciais de banco de dados e configurações de autenticação: VEJA SEÇÃO ABAIXO de Configuração.
6. Execute o script de configuração dos git-hooks (husky) `npm run husky:prepare`.

## Configuração

Para configurar o Snapflow CRM, siga estas etapas:

1. Utilize os arquivos `.env.development.sample` e `.env.test.sample` no diretório raiz do projeto e defina as variáveis de ambiente necessárias, como credenciais de banco de dados e configurações de autenticação.Para isso basta usar o comando na linha de comando bash ou git-bash:

```bash
cp .env.development.sample .env.development
cp .env.test.sample .env.test
cp .env.production.sample .env.production
```

Veja a configuração do banco de dados abaixo:

## Banco de Dados

Neste projeto estamos utilizando o Prisma, que é uma ferramenta de modelagem de dados e ORM (Object-Relational Mapping) que permite definir um esquema de banco de dados usando um formato legível e intuitivo. Ele gera automaticamente o código necessário para interagir com o banco de dados, como consultas, inserções, atualizações, exclusões, etc.

Para o desenvolvimento estamos utilizando o docker compose o PostgreSQL para emular um banco de dados local. Qualquer configuração extra de Banco de Dados deve ser feita através do arquivo schema.prisma no diretório /prisma, alterando as variáveis de ambiente .env relacionadas ao banco como `DATABASE_URL` e configurações adicionais no /src/config.
Para instalar o banco de dados para uso local de desenvolvimento, temos o docker compose configurado. Rode o seguinte comando:

```bash
npm run docker:dev:up
```
e para encerrar o container

```bash
npm run docker:dev:down
```

Após rodar o docker up, as configurações de container e do Banco de Dados Prisma serão executadas e a interface gráfica do Prisma Studio, que permite visualizar e interagir com o banco de dados. Durante o desenvolvimento, podemos usar o Prisma Studio para verificar as consultas geradas e verificar o estado do banco de dados.

Você ainda tem a opção de utilizar a ferramenta pgAdmin do PostgreSQL que é mais completa e
esta configurada no mesmo container.
Para isso, acesse seu localhost porta 5151 para ter acesso ao pgAdmin:

http://localhost:5151

Colocar o email de usuário e senha definido no docker-compose file:

Acessando o pg admin

  PGADMIN_DEFAULT_EMAIL: user@snap.com
  PGADMIN_DEFAULT_PASSWORD: snpwd

![Login-PgAdmin](https://gitlab.com/snapflow/backend/autenticacao/-/raw/DEV-1-autenticacao/readme-imgs/pgAdmin1.png)
![Login-PgAdmin](readme-imgs/pgAdmin1.png)

Clicar em "Adicionador Novo Servidor" ou "Add New Server":
  levar em conta as seguintes considerações:

![BemVindo-PgAdmin](https://gitlab.com/snapflow/backend/autenticacao/-/raw/DEV-1-autenticacao/readme-imgs/pgAdmin2.png)
![BemVindo-PgAdmin](readme-imgs/pgAdmin2.png)
* Na Aba General
Em 'Name' dar um nome a conexão, sugestão(snap-db):
![General-PgAdmin](https://gitlab.com/snapflow/backend/autenticacao/-/raw/DEV-1-autenticacao/readme-imgs/pgAdmin3.png)
![General-PgAdmin](readme-imgs/pgAdmin3.png)
* Na Aba Conexão
Em Name/address informar o nome do container que corresponde à instância do PostgreSQL (snap-db);
Em Port definir o valor 5432 (porta default de acesso ao container e disponível a partir da rede 'prisma-net'; não informar a porta em que o PostgreSQL foi mapeado no host);
No atributo Username será informado o usuário definido do PostgreSQL (snuser), bem como a senha correspondente em Password (snpwd).
![Conexao-PgAdmin](https://gitlab.com/snapflow/backend/autenticacao/-/raw/DEV-1-autenticacao/readme-imgs/pgAdmin4.png?ref_type=heads)
![Conexao-PgAdmin](readme-imgs/pgAdmin4.png)

## Serviço de Email

Neste projeto estamos utilizando o Nodemailer, que é um módulo do Node.js que permite que você envie e-mails a partir de um aplicativo JavaScript. Ele fornece uma maneira simples e conveniente de se conectar a um servidor de e-mail, autenticar-se e enviar e-mails usando o protocolo SMTP (Simple Mail Transfer Protocol).

O Nodemailer é amplamente utilizado para enviar notificações, confirmar contas de usuários, enviar relatórios e realizar outras tarefas relacionadas a e-mail em aplicativos Node.js.O Nodemailer é um módulo do Node.js que permite que você envie e-mails a partir de um aplicativo JavaScript. Ele fornece uma maneira simples e conveniente de se conectar a um servidor de e-mail, autenticar-se e enviar e-mails usando o protocolo SMTP (Simple Mail Transfer Protocol).

O Nodemailer é amplamente utilizado para enviar notificações, confirmar contas de usuários, enviar relatórios e realizar outras tarefas relacionadas a e-mail em aplicativos Node.js.
Com o Nodemailer, você pode enviar e-mails usando diferentes serviços de e-mail, como o GMail, o Outlook, o Yahoo Mail e muitos outros. Ele também suporta a autenticação de usuário e senha, tokens de acesso e outras opções de autenticação.

Para o desenvolvimento e testes de nossa aplicação, utilizamos o Ethereal que é um serviço de teste de e-mail que permite testar o envio de e-mails em um ambiente de desenvolvimento sem enviar e-mails reais para os destinatários.
Quando você cria uma conta no Ethereal, ele fornece um endereço de e-mail de teste e uma senha. Você pode usar essas credenciais para configurar o Nodemailer em seu aplicativo e enviar e-mails para o Ethereal em vez de enviar para um servidor de e-mail real.

Para configurar as variáveis de ambiente usando o Ethereal, você precisa seguir estes passos:

Crie uma conta no Ethereal (https://ethereal.email/create).
Após criar sua conta, você receberá um endereço de e-mail de teste.
Copie o endereço de e-mail e a senha fornecidos pelo Ethereal.
No arquivo .env.development(e .env.test ) , substitua as seguintes variáveis de ambiente:

```
SMTP_HOST=email-server
SMTP_PORT=587
SMTP_USERNAME=email-server-username
SMTP_PASSWORD=email-server-password
EMAIL_FROM=support@yourapp.com
```

por:

```
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USERNAME=<seu-endereco-de-email>
SMTP_PASSWORD=<sua-senha>
EMAIL_FROM=support@yourapp.com
Substitua <seu-endereco-de-email> pelo endereço de e-mail que você copiou do Ethereal e <sua-senha> pela senha correspondente.
```

Salve o arquivo .env.development(.env.test).
Agora você pode usar o Ethereal para testar o envio de e-mails no seu aplicativo.

## Rodando o Projeto em modo de Desenvolvimento ou Produção

### Rodando o projeto em desenvolvimento

Para rodar o projeto em modo de desenvolvimento, você pode executar o seguinte comando no terminal:

```bash
npm run dev
```

Este comando irá compilar o código TypeScript, iniciar o servidor de desenvolvimento, habilitar o modo de segurança do Express, habilitar o modo de depuração do Node.js, iniciar o monitoramento de arquivos e reiniciar o servidor automaticamente quando houver alterações nos arquivos.

### Fazendo o build e rodando o projeto em produção

Para fazer o build do projeto e rodar em produção, você pode executar os seguintes comandos no terminal:

Primeiro, execute o seguinte comando para compilar o código TypeScript e gerar o build:

```bash
npm run build
```

Este comando irá compilar o código TypeScript e gerar o código JavaScript otimizado para produção no diretório build.

Em seguida, execute o seguinte comando para iniciar o servidor em modo de produção:

```bash
npm start
```

Este comando irá iniciar o servidor Express com as configurações de produção, como habilitar o modo de produção do Express, habilitar o modo de segurança do Express e iniciar o servidor com as configurações do arquivo server.prod.ts.

Certifique-se de que o arquivo .env.production esteja configurado corretamente com as variáveis de ambiente necessárias para o ambiente de produção.

## Estrutura do Projeto

O projeto está estruturado da seguinte maneira:

- `src`: diretório que contém a aplicação.
  - `config`: contém configurações de bibliotecas externas, como autenticação, upload, email, etc.
  - `modules`: abriga as áreas de conhecimento da aplicação, diretamente relacionadas com as regras de negócios.
  - `shared`: contém módulos de uso geral compartilhados com mais de um módulo da aplicação, como o arquivo server.ts, o arquivo principal de rotas, conexão com banco de dados, etc.
  - `services`: contém serviços específicos para cada módulo da aplicação, responsáveis por todas as regras que a aplicação precisa atender.
- `prisma`: contém o schema do Prisma e as migrações do banco de dados.
- `scripts`: contém scripts de build e deploy geralmente em bash.

## Configurando as importações

Podemos usar um recurso que facilitará o processo de importação de arquivos em nosso projeto.

Iniciamos configurando o objeto paths do tsconfig.json, que permite criar uma base para cada path a ser buscado no projeto, funcionando de forma similar a um atalho:

```Json
"paths": {
  "@config/*": ["src/config/*"],
  "@modules/*": ["src/modules/*"],
  "@shared/*": ["src/shared/*"]
}
```

O nome dessa biblioteca é tsconfig-paths.
Agora, para importar qualquer arquivo no projeto, inicie o caminho com um dos paths configurados.

## Testes

Para executar os testes unitários, execute o comando `npm run test` para rodar todos ou `npm run test -- <parte do nome do seu teste>` para rodar um teste único ou um grupo de testes específico.

## Testes de integração

Antes de rodar o teste de integração favor certificar-se que seu .env.test está definido
e rodar

```bash
npm run docker:int:up
```

ou simplesmente rode os testes de integração como mencionados abaixo, pois eles já possuem os scripts para rodar este comando antes desse tipo de teste.

ao encerrar seus testes de integração, executar o comando

```bash
npm run docker:int:down
```

Para executar os testes de integração, execute o comando `npm run test:int` para rodar todos ou `npm run test:int -- <parte do nome do seu teste>` para rodar um teste único ou um grupo de testes específico.

## Documentação

Para gerar a documentação do projeto, execute o comando `npm run type-docs`. A documentação será gerada no diretório `docs`.

## Swagger

A documentação da Api está em ...(A ser definido)

## Contribuição

Se você deseja contribuir com o projeto, siga estas etapas:

1. Crie uma branch com a sua feature ou correção de bug(sua feature-branch).
2. Faça commit das suas alterações e faça push para a sua branch.
4. Abra um pull request para a branch de desenvolvimento(develop).

## Licença

Snapflow todos os direitos reservados
