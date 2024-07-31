# ip-scan-be

## Development notes

- Run `yarn install` then `yarn prepare` to install dependencies and prepare development environment

- When changing the `schema.prisma` file, remember to run `yarn db:migrate-dev` to create a new migration file in `./prisma` folder, so that the changes can be applied in the database.

## Deployment notes

- Run `yarn db:migrate` on server for database initalization and apply new migration to database.
