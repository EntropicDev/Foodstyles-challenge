import { ErrorHandler } from "../../library/error-handler.middleware";
import { db } from "../../config.db";

export class SearchRepo {
  private errorHandler: ErrorHandler = new ErrorHandler();
  extractEntities = async (searchTerm: string): Promise<any> => {
    try {
      let diet = await db.Diet.findAll({
        where: {
          name: {
            [db.Sequelize.Op.like]: `%${searchTerm}%`,
          },
        },
        include: [db.Brand],
      });
      return diet;
    } catch (error: any) {
      this.errorHandler.passthrough(error, "DB Repo: extractEntities");
      return false;
    }
  };
}
