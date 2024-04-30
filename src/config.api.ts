import { db } from "./config.db";
import { healthAPI } from "./modules/health/health.api";
import { UsersAPI } from "./modules/user/user.api";
import { GenericAPI } from "./library/generic.api";
import { AuthAPI } from "./modules/auth/auth.api";
import { GroupAPI } from "./modules/group/group.api";
import * as userRules from "./modules/user/user.rules";
import * as permissionRules from "./modules/permission/permission.rules";
import * as groupRules from "./modules/group/group.rules";
import * as authRules from "./modules/auth/auth.rules";
export async function routes(app: any) {
  await healthAPI(app);

  const permissionAPI = new GenericAPI(
    "/permissions",
    app,
    permissionRules,
    "permissions",
    db.Permission,
    db
  );
  await permissionAPI.standardRoutes();

  const groupAPI = new GroupAPI(
    "/groups",
    app,
    groupRules,
    "groups",
    db.Group,
    db
  );
  await groupAPI.customRoutes();

  const userAPI = new UsersAPI("/users", app, userRules, "users", db.User, db);
  await userAPI.customRoutes();

  const authAPI = new AuthAPI("/auth", app, authRules, "auth", null, db);
  await authAPI.customRoutes();
}
