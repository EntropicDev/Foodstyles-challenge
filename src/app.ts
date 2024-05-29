import { Port } from "./config";
import { CustomError } from "./library/custom-error";
import { ErrorHandler } from "./library/error-handler.middleware";
import * as routes from "./config.api";

const express = require("express");
const cors = require("cors");

const errorHandler = new ErrorHandler();
const app = express();
const StartServer = async () => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cors());

  try {
    routes.routes(app);
  } catch (error) {
    throw new CustomError("API Error", 400, { error });
  }
  app.use(errorHandler.handle());
  app
    .listen(Port, () => {
      console.log(`listening to port ${Port}`);
    })
    .on("error", (err: any) => {
      console.log(err);
      process.exit();
    })
    .on("close", () => {
      process.exit();
    });
};
try {
  StartServer();
  process.on("unhandledRejection", (reason, p) => {
    console.log("Unhandled Rejection at: Promise", p, "reason:", reason);
    process.exit();
  });
} catch (error) {
  console.log(error);
}
