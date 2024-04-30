import { Permission } from "./modules/permission/permission.model";
import { db } from "./config.db";
import compilePermissions from "./permissions.seeder";

async function sync(): Promise<any> {
  console.log("Syncing DB");
  await db.sequelize.sync({ force: true });
  console.log("Sync complete");
  console.log("Seeding permissions");
  let permissionList: Permission[] | any = compilePermissions();
  let group = await db.Group.findOrCreate({
    where: { name: "Super Users", admin: true },
  });
  for (let i = 0; i < permissionList.length; i++) {
    const permission = permissionList[i];
    let newPermission = await db.Permission.findOrCreate({
      where: { ...permission },
    });
    await group[0].addPermission(newPermission[0].id);
  }
  console.log("Seeding complete");
  process.exit();
}
sync();
