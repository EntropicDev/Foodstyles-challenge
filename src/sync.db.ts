import { db } from "./config.db";
import dietSeeder from "./modules/diet/diet.seeder";
import dishTypeSeeder from "./modules/dish-type/dish-type.seeder";
import brandSeeder from "./modules/brand/brand.seeder";
import citySeeder from "./modules/city/city.seeder";

async function sync(): Promise<any> {
  console.log("Syncing DB");
  await db.sequelize.sync({ force: true });
  console.log("Sync complete");
  await dietSeeder(db.Diet);
  await dishTypeSeeder(db.DishType);
  await brandSeeder(db.Brand);
  await citySeeder(db.City);
  process.exit();
}
sync();
