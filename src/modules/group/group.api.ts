import { AuthenticateMiddleware } from "../../library/authenticate.middleware";
import { ErrorHandler } from "../../library/error-handler.middleware";
import { GenericAPI } from "../../library/generic.api";
import { ValidationMiddleware } from "../../library/validation.middleware";
import { GroupRepo } from "./group.repo";
import { GroupService } from "./group.service";

export class GroupAPI extends GenericAPI {
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
    let validation = new ValidationMiddleware();
    let auth = new AuthenticateMiddleware();
    let errorHandler: ErrorHandler = new ErrorHandler();
    let groupRepo: GroupRepo = new GroupRepo(
      this.getDBObject(),
      this.getRules(),

      this.getDBObject()
    );
    let groupsService = new GroupService(this.getDataRepo());
    // Add Member to Group
    app.post(
      `${path}/:id/members/:uuid`,
      // auth.checkPermission("groups.addMember"),
      validation.validateParams(["id", "uuid"], this.getRules().addMember),
      async (req: any, res: any, next: any) => {
        try {
          res.json(await groupRepo.addMember(req.params.id, req.params.uuid));
        } catch (error: any) {
          errorHandler.apiErrorHandler(error, res);
        }
      }
    );
    // Remove member from group
    app.delete(
      `${path}/:id/members/:uuid`,
      auth.checkPermission("groups.removeMember"),
      validation.validateParams(["id", "uuid"], this.getRules().deleteMember),
      async (req: any, res: any, next: any) => {
        try {
          res.json(
            await groupRepo.removeMember(req.params.id, req.params.uuid)
          );
        } catch (error: any) {
          errorHandler.apiErrorHandler(error, res);
        }
      }
    );
    // Get group members
    app.get(
      `${path}/:id/members`,
      auth.checkPermission("groups.getMembers"),
      validation.validateParams(["id"], this.getRules().groupIdExists),
      async (req: any, res: any, next: any) => {
        try {
          res.json(await groupRepo.getMembers(req.params.id));
        } catch (error: any) {
          // console.log(error);
          errorHandler.apiErrorHandler(error, res);
        }
      }
    );
    // Get groups permissions
    app.get(
      `${path}/:groupIds/permissions`,
      auth.checkPermission("groups.getPermissions"),
      validation.validateParams(["groupIds"], this.getRules().groupIdsExists),
      async (req: any, res: any, next: any) => {
        try {
          res.json(
            await groupsService.getGroupsPermissions(
              req.params.groupIds.split(",")
            )
          );
        } catch (error: any) {
          errorHandler.apiErrorHandler(error, res);
        }
      }
    );
    this.standardRoutes(); // Needed so that the original routes are overwritten with any custom routes above
  };
}
