# Criar um container com o banco de dados postgres

docker run \
 --name postgres \
 -e POSTGRES_USER=admin \
 -e POSTGRES_PASSWORD=pwd \
 -e POSTGRES_DB=herois \
 -p 5432:5432 \
 -d \
 postgres

# Iniciar o container com o banco de dados postgres

docker start postgres

# Criar um container com uma interface para administração de SGBDs

docker run \
 --name adminer \
 -p 8001:8080 \
 --link postgres:postgres \
 -d \
 adminer

# Iniciar o container com a interface de adminitração de SGBDs

docker start adminer

# Criar as tabelas

Executar o comando de criação de tabela existente no arquivo
postgres.sql

# Criar um container para rodar o mongodb

docker run \
 --name mongodb \
 -p 27217:27017 \
 -e MONGO_INITDB_ROOT_USERNAME=admin \
 -e MONGO_INITDB_ROOT_PASSWORD=pwd \
 -d \
 mongo:4

# Iniciar o container com o mongodb

docker start mongodb

# Criar um usuário para aplicação

docker exec -it mongodb \
 mongo --host localhost --port 27017 -u admin -p pwd --authenticationDatabase admin \
 --eval "db.getSiblingDB('herois').createUser({user: 'user', pwd: 'pwd', roles: [{role: 'readWrite', db: 'herois'}]})"

# Conectar no client do mongo dentro do container como "user" e no database "herois"

docker exec -it mongodb \
 mongo herois --host localhost --port 27017 -u user -p pwd --authenticationDatabase herois

# Após rodar os testes, o seguinte usuário é criado para acessso via swagger

http://localhost:3000/documentation

Rota (/login):
{
"username": "teste",
"password": "123"
}

# Comando "npm start" com variáveis de ambiente:

HTTP_PORT=3000 URL_MONGODB="mongodb://user:pwd@localhost:27217/herois" URL_POSTGRES="postgres://admin:pwd@localhost/herois" JWT_SECRET="963$meutokenseguro$147" JWT_SECRET="963$meutokenseguro$147" SALT_ROUNDS="10" npm start
