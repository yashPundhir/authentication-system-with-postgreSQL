- if .env file is not in the root folder, then dotenv.config() will be like this:

  ```javascript
  dotenv.config({ path: "./src/" });
  ```

- with `prisma`, DB connect is not required as it does all the magic behind the scenes, but with `mongoose`, DB connect is required.
