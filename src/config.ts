import dotEnv from "dotenv";

console.log(`Current environment: ${process.env.NODE_ENV}`);
if (process.env.NODE_ENV !== "prod") {
  const configFile = `./.env.${process.env.NODE_ENV}`;
  dotEnv.config({ path: configFile });
} else {
  dotEnv.config();
}
console.log(process.env.SQL_DATABASE);
// DB Variables
export const Port = process.env.PORT;
export const SQLDialect = process.env.SQL_DIALECT;
export const SQLDB = process.env.SQL_DATABASE;
export const SQLUser = process.env.SQL_USER;
export const SQLPWD = process.env.SQL_PASSWORD;
export const SQLHost = process.env.SQL_HOST;
export const SQLPort = process.env.SQL_PORT;
export const SQLLogging = process.env.SQL_LOGGING;
