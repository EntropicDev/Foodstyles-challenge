import { SQLDB, SQLDialect, SQLHost, SQLPWD, SQLPort, SQLUser } from "./config";
import { GroupDef } from "./modules/group/group.db";
import { PermissionDef } from "./modules/permission/permission.db";
import { UserDef } from "./modules/user/user.db";
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  SQLDB,
  SQLUser,
  SQLPWD,
  {
    dialect: SQLDialect,
    host: SQLHost,
    port: SQLPort,
    logging: false,
  },
  {
    timezone: "+02:00",
  }
);
export const db = {
  Sequelize: Sequelize,
  sequelize: sequelize,
  Op: Sequelize.Op,
  User: UserDef(sequelize, Sequelize),
  Permission: PermissionDef(sequelize, Sequelize),
  Group: GroupDef(sequelize, Sequelize),
};

/* 
    Relationship Declarations
*/
// Permission Relationships
db.Permission.belongsToMany(db.Group, { through: "groupPermissions" });

// Group Relationships
db.Group.belongsToMany(db.Permission, { through: "groupPermissions" });
db.Group.belongsToMany(db.User, { through: "userGroups" });

// User Relationships
db.User.belongsToMany(db.Group, { through: "userGroups" });
