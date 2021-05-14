
# Rick & Morty API

Esto es una API básica para los datos de Rick & Morty.
También incluye front-end React.js

## Requisitos

- Node.js 14
- Yarn 1.22
- PostgreSQL 12

## Instalación

Se debe tener creada la base de datos y colocar la información de la
misma en el archivo `.env`. Puede observar un ejemplo en `.env.example`.

Luego se deben instalar las dependencias con `yarn`. Para poblar la
base de datos debe ejecutar el comando `yarn setup`.

## Ejecución

Para ejecutarlo en modo development, debe hacer los siguientes comandos: 

```sh
# server
PORT=3001 bin/www &

# client
cd client/
yarn start
```

## Author

Gustavo Paulo <gustavo.paulo.segura@gmail.com>