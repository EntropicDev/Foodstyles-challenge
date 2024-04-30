import { CustomError } from "./custom-error";
import { ErrorHandler } from "./error-handler.middleware";
import { Validation } from "./validation";
export class ValidationMiddleware {
  private validator: Validation = new Validation();
  private errorHandler: ErrorHandler = new ErrorHandler();

  validate = (rules: any) => {
    return [
      async (req: any, res: any, next: any) => {
        try {
          if (req.headers.authorization === undefined) {
            throw new CustomError("No authorization header", 401, null);
          }
          await this.validator.isValidData(req.body, rules);
          next();
        } catch (error) {
          this.errorHandler.apiErrorHandler(error, res);
        }
      },
    ];
  };
  validateParams = (keys: string[], rules: any) => {
    return [
      async (req: any, res: any, next: any) => {
        try {
          if (req.headers.authorization === undefined) {
            throw new CustomError("No authorization header", 401, null);
          }
          const mappedParams: { [key: string]: string } = {};
          keys.forEach((key) => {
            mappedParams[key] = req.params[key];
          });
          await this.validator.isValidData(mappedParams, rules);
          next();
        } catch (error) {
          this.errorHandler.apiErrorHandler(error, res);
        }
      },
    ];
  };
  validateAll = (keys: string[], rules: any) => {
    return [
      async (req: any, res: any, next: any) => {
        try {
          if (req.headers.authorization === undefined) {
            throw new CustomError("No authorization header", 401, null);
          }
          const mappedParams: { [key: string]: string } = {};
          keys.forEach((key) => {
            mappedParams[key] = req.params[key];
          });
          let data = req.body;
          await this.validator.isValidData({ ...data, ...mappedParams }, rules);
          next();
        } catch (error) {
          this.errorHandler.apiErrorHandler(error, res);
        }
      },
    ];
  };
}
