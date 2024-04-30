import { CustomError } from "./custom-error";
import { ErrorHandler } from "./error-handler.middleware";
import { HTTP } from "./http";

export class AuthenticateMiddleware {
  private http: HTTP = new HTTP();
  private authURL =
    process.env.AUTH_URL || `http://localhost:${process.env.PORT}`;
  private errorHandler: ErrorHandler = new ErrorHandler();

  checkPermission = (fxn: string) => {
    return [
      async (req: any, res: any, next: any) => {
        try {
          // console.log("Checking Permission For: ", fxn);
          // req.body.permissionINJ = await this.http.get(
          //   `/auth/hasPermission/${fxn}`,
          //   req.headers.authorization.split(" ")[1],
          //   true
          // );
          // if (req.body.permissionINJ === false) {
          //   throw new CustomError("Invalid permission", 401, null);
          // }
          req.body.permissionINJ = {
            uuid: "8aa8b26c-9157-476a-b198-22a694cfd1dc",
            email: "brian@entropic.co.za",
            name: "Brian",
            surname: "Knott",
            outcome: true,
            fxn: "users.getGroups",
          };
          next();
        } catch (error) {
          this.errorHandler.apiErrorHandler(error, res);
        }
      },
    ];
  };
}
