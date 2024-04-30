import { CustomError } from "./custom-error";

export class ErrorHandler {
  /**
   * Custom error handler to standardize error objects returned to
   * the client
   *
   * @param err Error caught by Express.js
   * @param req Request object provided by Express
   * @param res Response object provided by Express
   * @param next NextFunction function provided by Express
   */
  handle = (): any => {
    return function (err: any, req: any, res: any, next: any) {
      let customError = err;
      if (!(err instanceof CustomError)) {
        console.log(err);
        customError = new CustomError(
          "Umm, seems like something broke! Please try again later."
        );
      }
      res.status(customError.status).send(customError);
    };
  };
  passthrough = (error: any, msg: string): any => {
    console.log(error);
    if (error.status !== undefined) {
      throw new CustomError(error.message, error.status, error.additionalInfo);
    } else {
      throw new CustomError(msg, 500, null);
    }
  };
  apiErrorHandler = (error: any, res: any): any => {
    console.log(error);
    if (error.status !== undefined) {
      res.status(error.status).json({
        message: error.message,
        additionalInfo: error.additionalInfo,
      });
    } else {
      res.status(500).json({ message: "Critical Error" });
    }
  };
}
