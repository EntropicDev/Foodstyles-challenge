import * as userPermissions from "./modules/user/user.permissions.seeder";
import * as groupPermissions from "./modules/group/group.permissions.seeder";
export default function compilePermissions() {
  let permissions: any[] = [];
  permissions = permissions.concat(userPermissions.permissions);
  permissions = permissions.concat(groupPermissions.permissions);
  return permissions;
}
