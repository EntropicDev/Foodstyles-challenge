import { ErrorHandler } from "../../library/error-handler.middleware";
import { db } from "../../config.db";

export class CityRepo {
  private errorHandler: ErrorHandler = new ErrorHandler();
  searchCities = async (searchTerms: string[]): Promise<any> => {
    try {
      return await db.City.findAll({
        where: {
          name: {
            [db.Sequelize.Op.or]: searchTerms.map((term) => ({
              [db.Sequelize.Op.like]: `%${term}%`,
            })),
          },
        },
      });
    } catch (error: any) {
      this.errorHandler.passthrough(error, "DB Repo: searchCities");
      return false;
    }
  };
}
