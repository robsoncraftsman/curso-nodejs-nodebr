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
