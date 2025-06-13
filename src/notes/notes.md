- if .env file is not in the root folder, then dotenv.config() will be like this:

  ```javascript
  dotenv.config({ path: "./src/" });
  ```

- with `prisma`, DB connect is not required as it does all the magic behind the scenes, but with `mongoose`, DB connect is required.

- understand the thoery of authorization with tokens in `Prisma Express and Postgresql database in backend` video from `01:34:00` to `02:52:00`
