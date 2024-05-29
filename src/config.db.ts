import { SQLDB, SQLDialect, SQLHost, SQLPWD, SQLPort, SQLUser } from "./config";
import { BrandDef } from "./modules/brand/brand.db";
import { CityDef } from "./modules/city/city.db";
import { DietDef } from "./modules/diet/diet.db";
import { DishTypeDef } from "./modules/dish-type/dish-type.db";
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
  Diet: DietDef(sequelize, Sequelize),
  DishType: DishTypeDef(sequelize, Sequelize),
  Brand: BrandDef(sequelize, Sequelize),
  City: CityDef(sequelize, Sequelize),
};

/* 
    Relationship Declarations
*/
