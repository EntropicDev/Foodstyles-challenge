import { AuthenticateMiddleware } from "../../library/authenticate.middleware";
import { ErrorHandler } from "../../library/error-handler.middleware";
import { GenericAPI } from "../../library/generic.api";
import { ValidationMiddleware } from "../../library/validation.middleware";
import { UserRepo } from "./user.repo";
import { UserService } from "./user.service";

export class UsersAPI extends GenericAPI {
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
    let app = this.getApp();
    let path = this.getPath();
    let permissionPrefix = this.getPermissionPrefix();
    let userService = new UserService(this.getDataRepo());
    let validation = new ValidationMiddleware();
    let auth = new AuthenticateMiddleware();
    let errorHandler: ErrorHandler = new ErrorHandler();
    let userRepo: UserRepo = new UserRepo(
      this.getDBObject(),
      this.getRules(),
      this.getDB()
    );

    // Create User
    app.post(
      `${path}`,
      // auth.checkPermission(`users.create`),
      validation.validate(this.getRules().create),
      async (req: any, res: any, next: any) => {
        try {
          res.json(await userService.create(req.body));
        } catch (error: any) {
          if (error.status !== undefined) {
            res
              .status(error.status)
              .json({ message: error.message, error: error.additionalInfo });
          } else {
            res.status(500).json({ message: "An unknown error has occured" });
          }
        }
      }
    );

    // Get User Pwd from email
    app.get(
      `${path}/pwd/:email`,
      auth.checkPermission("users.getPwd.fromEmail"),
      validation.validateParams(["email"], this.getRules().emailQuery),
      async (req: any, res: any, next: any) => {
        try {
          res.json(await userRepo.withPwd("email", req.params.email));
        } catch (error: any) {
          errorHandler.apiErrorHandler(error, res);
        }
      }
    );

    /**
     * ======================================================================================================
     *
     * Group Utility
     *
     * Remove if Group is not needed in User Feature
     *
     * ======================================================================================================
     */
    // Get Groups
    app.get(
      `${path}/:id/groups`,
      auth.checkPermission("users.getGroups"),
      validation.validateParams(["id"], this.getRules().idExists),
      async (req: any, res: any, next: any) => {
        try {
          res.json(await userRepo.getGroups(req.params.id));
        } catch (error: any) {
          errorHandler.apiErrorHandler(error, res);
        }
      }
    );

    this.standardRoutes(); // Needed so that the original routes are overwritten with any custom routes above
  };
}
