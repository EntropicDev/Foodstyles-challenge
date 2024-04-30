import { GenericRepo } from "./generic.repo";
import { AuthenticateMiddleware } from "./authenticate.middleware";
import { ValidationMiddleware } from "./validation.middleware";

export class GenericAPI {
  constructor(
    private path: string,
    private app: any,
    private rules: any,
    private permissionPrefix: string,
    private dbObject: any,
    private db: any
  ) {}
  private dataRepo = new GenericRepo(this.dbObject, this.rules, this.db);
  private auth = new AuthenticateMiddleware();
  private validation = new ValidationMiddleware();

  getApp = () => {
    return this.app;
  };
  getPath = () => {
    return this.path;
  };
  getRules = () => {
    return this.rules;
  };
  getPermissionPrefix = () => {
    return this.permissionPrefix;
  };
  getDBObject = () => {
    return this.dbObject;
  };
  getDataRepo = () => {
    return this.dataRepo;
  };
  getDB = () => {
    return this.db;
  };
  standardRoutes = async () => {
    this.app.get(
      `${this.path}/:id`,
      this.auth.checkPermission(`${this.permissionPrefix}.getOne`),
      this.validation.validateParams(["id"], this.getRules().getOneRule),
      async (req: any, res: any, next: any) => {
        try {
          res.json(await this.dataRepo.getOne(req.params.id));
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
    this.app.get(
      `${this.path}/`,
      this.auth.checkPermission(`${this.permissionPrefix}.getAll`),
      async (req: any, res: any, next: any) => {
        try {
          res.json(await this.dataRepo.getAll());
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
    this.app.post(
      `${this.path}/`,
      this.auth.checkPermission(`${this.permissionPrefix}.create`),
      this.validation.validate(this.getRules().createRule),
      async (req: any, res: any, next: any) => {
        try {
          console.log(this.getRules().create);
          res.json(await this.dataRepo.create(req.body));
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
    this.app.put(
      `${this.path}/:id`,
      this.auth.checkPermission(`${this.permissionPrefix}.update`),
      this.validation.validateAll(["id"], this.getRules().updateRule),
      async (req: any, res: any, next: any) => {
        try {
          res.json(await this.dataRepo.update(req.params.id, req.body));
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
    this.app.delete(
      `${this.path}/:id`,
      this.auth.checkPermission(`${this.permissionPrefix}.delete`),
      this.validation.validateParams(["id"], this.getRules().deleteRule),
      async (req: any, res: any, next: any) => {
        try {
          res.json(await this.dataRepo.delete(req.params.id));
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
  };
}
