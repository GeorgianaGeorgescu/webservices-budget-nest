## Before starting the project
- Create a .env
``` 
DATABASE_URL=mysql://<USERNAME>:<PASSWORD>@localhost:3306/<DATABASE_NAME>
ARGON_HASH_LENGTH=length
ARGON_TIME_COST=time
ARGON_MEMORY_COST= memory
AUTH_JWT_AUDIENCE=audience
AUTH_JWT_ISSUER=issuer
```
- Create a .env.development
```
NODE_ENV=development
AUTH_JWT_SECRET=<YOUR-JWT-SECRET> 
AUTH_JWT_EXPIRATION_INTERVAL=expiration
PORT=port
LOG_LEVEL=silly
LOG_DISABLED=false
```

## Project setup

```bash
$ yarn install

$ yarn prisma migrate dev --name init

$ yarn prisma db seed
```

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Run tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```
