import { CustomError } from "./custom-error";
import { ErrorHandler } from "./error-handler.middleware";
import { Validation } from "./validation";

export class GenericRepo {
  private validator: Validation = new Validation();
  private errorHandler: ErrorHandler = new ErrorHandler();
  constructor(private model: any, private rules: any, private db: any) {}
  getErrorHandler = () => {
    return this.errorHandler;
  };
  getModel = () => {
    return this.model;
  };
  getRules = () => {
    return this.rules;
  };
  getDB = () => {
    return this.db;
  };
  getOne = async (id: any): Promise<any> => {
    try {
      await this.validator.isValidData({ id }, this.rules.getOne);
      return await this.model.findByPk(id);
    } catch (error: any) {
      if (error.status !== undefined) {
        throw new CustomError(
          error.message,
          error.status,
          error.additionalInfo
        );
      } else {
        throw new CustomError("DB Repo: getOne", 500, { error });
      }
    }
  };
  updateField = async (id: any, field: any, value: any): Promise<any> => {
    try {
      return await this.model.update({ [field]: value }, { where: { id: id } });
    } catch (error: any) {
      this.errorHandler.passthrough(error, "DB Repo: updateField");
    }
  };
  getByField = async (field: any, value: any): Promise<any> => {
    try {
      return await this.model.findOne({ where: { [field]: value } });
    } catch (error: any) {
      console.log(error);
      this.errorHandler.passthrough(error, "DB Repo: getByField");
    }
  };
  getByCustom = async (data: any): Promise<any> => {
    try {
      return await this.model.findOne({ where: data });
    } catch (error: any) {
      this.errorHandler.passthrough(error, "DB Repo: getByCustom");
    }
  };
  getAll = async (): Promise<any> => {
    try {
      let sort = {};
      if (this.getRules().defaultSort !== undefined) {
        sort = {
          order: [
            [
              this.getRules().defaultSort.sortBy,
              this.getRules().defaultSort.direction,
            ],
          ],
        };
      }
      return await this.model.findAll(sort);
    } catch (error: any) {
      if (error.status !== undefined) {
        throw new CustomError(
          error.message,
          error.status,
          error.additionalInfo
        );
      } else {
        throw new CustomError("DB Repo: getAll", 500, { error });
      }
    }
  };
  create = async (data: any): Promise<any> => {
    try {
      await this.validator.isValidData(data, this.rules.create);
      return await this.model.create(data);
    } catch (error: any) {
      if (error.status !== undefined) {
        throw new CustomError(
          error.message,
          error.status,
          error.additionalInfo
        );
      } else {
        throw new CustomError("DB Repo: create", 500, { error });
      }
    }
  };
  update = async (id: any, data: any): Promise<any> => {
    try {
      await this.validator.isValidData({ id, ...data }, this.rules.update);
      return await this.model.update(data, { where: { id: id } });
    } catch (error: any) {
      if (error.status !== undefined) {
        throw new CustomError(
          error.message,
          error.status,
          error.additionalInfo
        );
      } else {
        throw new CustomError("DB Repo: update", 500, { error });
      }
    }
  };
  delete = async (id: any): Promise<any> => {
    try {
      await this.validator.isValidData({ id }, this.rules.deleteRule);
      let data = await this.getOne(id);
      if (data !== null) {
        data.destroy();
      } else {
        throw new CustomError("Invalid data item", 400, {});
      }
      return true;
    } catch (error: any) {
      if (error.status !== undefined) {
        throw new CustomError(
          error.message,
          error.status,
          error.additionalInfo
        );
      } else {
        throw new CustomError("DB Repo: delete", 500, { error });
      }
    }
  };
}
