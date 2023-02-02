# Node.js Boilerplate

Install:

```
$ npm install
```

Start the project without swagger:

```
$ npm start
```


## Prisma (DB)

Change DB config in the root file .env

Use build-db to create DB

```
$ npm run build-db
```

Use seed-db to start with demo data

```
$ npm run seed-db
```

## Swagger (Documentation)

Start the server generating the documentation with swagger:

```
$ npm run start-swagger
```

Access to the documentation (default port 3000):

[http://localhost:3000/doc](http://localhost:3000/doc)

## Project Structure
- config
- prisma
- src
  - const
  - controllers
  - core
  - helpers
  - middlewares
  - models
  - routes
  - validators
- swagger
- tests

