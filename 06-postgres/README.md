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
