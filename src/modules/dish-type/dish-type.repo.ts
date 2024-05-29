import { ErrorHandler } from "../../library/error-handler.middleware";
import { db } from "../../config.db";

export class DishTypeRepo {
  private errorHandler: ErrorHandler = new ErrorHandler();
  searchDishTypes = async (searchTerms: string[]): Promise<any> => {
    try {
      return await db.DishType.findAll({
        where: {
          name: {
            [db.Sequelize.Op.or]: searchTerms.map((term) => ({
              [db.Sequelize.Op.like]: `%${term}%`,
            })),
          },
        },
      });
    } catch (error: any) {
      this.errorHandler.passthrough(error, "DB Repo: searchDishTypes");
      return false;
    }
  };
}
