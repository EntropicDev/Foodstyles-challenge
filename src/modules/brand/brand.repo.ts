import { ErrorHandler } from "../../library/error-handler.middleware";
import { db } from "../../config.db";

export class BrandRepo {
  private errorHandler: ErrorHandler = new ErrorHandler();
  searchBrands = async (searchTerms: string[]): Promise<any> => {
    try {
      return await db.Brand.findAll({
        where: {
          name: {
            [db.Sequelize.Op.or]: searchTerms.map((term) => ({
              [db.Sequelize.Op.like]: `%${term}%`,
            })),
          },
        },
      });
    } catch (error: any) {
      this.errorHandler.passthrough(error, "DB Repo: searchBrands");
      return false;
    }
  };
}
