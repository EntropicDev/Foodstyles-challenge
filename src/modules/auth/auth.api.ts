import { Validation } from "../../library/validation";
import { AuthService } from "./auth.service";
import { OneTimePinService } from "../one-time-pin/one-time-pin.service";
import * as otpRules from "../one-time-pin/one-time-pin.rules";
import { GenericAPI } from "../../library/generic.api";
import { ValidationMiddleware } from "../../library/validation.middleware";
import { ErrorHandler } from "../../library/error-handler.middleware";

export class AuthAPI extends GenericAPI {
  constructor(
    url: string,
    app: any,
    rules: any,
    permissionPrefix: string,
    dbObject: any,
    db: any
  ) {
    super(url, app, rules, permissionPrefix, dbObject, db);
    // Add any additional properties or methods specific to ExtendedAPI here
  }

  customRoutes = async () => {
    const service = new AuthService();
    const otpService = new OneTimePinService();
    let validation = new ValidationMiddleware();
    let errorHandler: ErrorHandler = new ErrorHandler();
    let app = this.getApp();
    let path = this.getPath();

    app.post(
      `${path}`,
      // auth.checkPermission("payfast.sendDeductionNotifications"),
      validation.validate(this.getRules().localLogin),
      async (req: any, res: any, next: any) => {
        try {
          res.json(await service.localLogin(req.body.email, req.body.pwd));
        } catch (error: any) {
          console.log(error);
          errorHandler.apiErrorHandler(error, res);
        }
      }
    );
    // app.post(
    //   "/authenticateWithAzure",
    //   async (req: any, res: any, next: any) => {
    //     try {
    //       const token = await service.loginWithAzure(req.body);
    //       res.json({ JWT: token });
    //     } catch (error: any) {
    //       next(error);
    //     }
    //   }
    // );
    // app.post("/authenticate", async (req: any, res: any, next: any) => {
    //   try {
    //     const token = await service.loginViaOTP(req.body);
    //     res.json({ JWT: token });
    //   } catch (error: any) {
    //     next(error);
    //   }
    // });
    // app.post(`${path}/otp`, async (req: any, res: any, next: any) => {
    //   try {
    //     await validator.isValidData({ ...req.body }, otpRules.create);
    //     await otpService.create(req.body, 30000);
    //     res.status(200).json({ message: "OTP Sent" });
    //   } catch (error: any) {
    //     next(error);
    //   }
    // });
    // app.post(
    //   `${path}/otp/authenticate`,
    //   async (req: any, res: any, next: any) => {
    //     try {
    //       await service.loginViaOTP(req.body);
    //       res.status(200).json({ message: "OTP Sent" });
    //     } catch (error: any) {
    //       next(error);
    //     }
    //   }
    // );
    app.get(
      `${path}/hasPermission/:fxn`,
      validation.validateParams(["fxn"], this.getRules().fxnExists),
      async (req: any, res: any, next: any) => {
        try {
          res.json(
            await service.hasPermission(
              req.headers.authorization,
              req.params.fxn
            )
          );
        } catch (error: any) {
          next(error);
        }
      }
    );
    // app.post("/hasPermissions", async (req: any, res: any, next: any) => {
    //   try {
    //     res.json(
    //       await service.hasPermissions(req.headers.authorization, req.body.fxns)
    //     );
    //   } catch (error: any) {
    //     next(error);
    //   }
    // });
  };
}
