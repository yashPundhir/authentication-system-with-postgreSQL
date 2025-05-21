- if .env file is not in the root folder, then dotenv.config() will be like this:
  ```javascript
  dotenv.config({ path: "./src/" });
  ```
