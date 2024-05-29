import { ErrorHandler } from "../../library/error-handler.middleware";
import { db } from "../../config.db";

export class DietRepo {
  private errorHandler: ErrorHandler = new ErrorHandler();
  searchDiets = async (searchTerms: string[]): Promise<any> => {
    try {
      return await db.Diet.findAll({
        where: {
          name: {
            [db.Sequelize.Op.or]: searchTerms.map((term) => ({
              [db.Sequelize.Op.like]: `%${term}%`,
            })),
          },
        },
      });
    } catch (error: any) {
      this.errorHandler.passthrough(error, "DB Repo: searchDiets");
      return false;
    }
  };
}
