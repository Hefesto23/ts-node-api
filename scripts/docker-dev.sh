#!/bin/bash
DIR="$(cd "$(dirname "$0")" && pwd)"
source $DIR/setenv.sh

echo "****************************************************************"
echo "*                                                              *"
echo "*                  Snapflow Docker Scripts                     *"
echo "*                                                              *"
echo "****************************************************************"
echo "*                  AMAMOS O VINI NOSSO HERÓI                   *"
echo "****************************************************************"
if [[ $NODE_ENV = "test" ]]; then
  echo "Ambiente de Teste detectado! Usando o banco de dados de teste..."
  npm run docker:dev:down
  CONTAINER_NAME="snap-test-db"
  COMPOSE_FILE="docker-compose.integration.yml"
elif [[ $NODE_ENV = "development" ]]; then
  npm run docker:int:down
  echo "Ambiente de Dev detectado! Usando o banco de dados de desenvolvimento..."
  CONTAINER_NAME="snap-db"
  COMPOSE_FILE="docker-compose.dev.yml"
else
  echo "######### Erro: Ambiente desconhecido. #########"
  echo "O ambiente informado não existe.
  Verifique se o NODE_ENV esta definido corretamente!"
  exit 1
fi

COMPOSE_COMMAND="docker-compose -f $COMPOSE_FILE up -d"
# Checa se o docker-compose já está rodando
if  [ ! "$(docker ps --filter name=$CONTAINER_NAME --format '{{.Status}}' | grep 'Up')" ]; then
  echo "Docker Compose Dev não está rodando. Iniciando..."
  eval $COMPOSE_COMMAND # Roda o comando em background
  echo '🟡 - Esperando o Banco de Dados ficar pronto...'
  $DIR/wait-for-it.sh "${DATABASE_URL}" -- echo '🟢 - Banco de Dados pronto!'
  echo "Iniciando migração e pre configuração do Prisma e do prisma client"
  # No ambiente de desenvolvimento,
  # use o migrate dev para gerar tipos e aplicar migrações, leia mais em:
  # https://www.prisma.io/docs/orm/prisma-migrate/workflows/development-and-production
  npx prisma migrate dev
  if [[ $NODE_ENV = "development" ]]; then
    npx prisma studio
  fi
else
    echo "Docker Compose Dev já está rodando."
fi
