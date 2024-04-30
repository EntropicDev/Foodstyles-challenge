import { GenericRepo } from "../../library/generic.repo";

export class UserRepo extends GenericRepo {
  constructor(model: string, rules: any, db: any) {
    super(model, rules, db);
  }
  emailExists = async (email: string): Promise<Boolean> => {
    try {
      let user = await this.getByField("email", email);
      if (user) {
        return true;
      }
      return false;
    } catch (error: any) {
      this.getErrorHandler().passthrough(error, "DB Repo: emailExists");
      return false;
    }
  };
  withPwd = async (field: any, value: any): Promise<any> => {
    try {
      return await this.getModel().findOne({
        where: { [field]: value },
        attributes: { include: ["pwd"] },
      });
    } catch (error: any) {
      this.getErrorHandler().passthrough(error, "DB Repo: pwdOnly");
    }
  };

  /**
   * ======================================================================================================
   *
   * Group Utility
   *
   * Remove if Group is not needed in User Feature
   *
   * ======================================================================================================
   */
  getGroups = async (id: string): Promise<any[]> => {
    try {
      let user = await this.getOne(id);
      if (user === null) {
        return [];
      }
      return await user.getGroups();
    } catch (error: any) {
      this.getErrorHandler().passthrough(error, "DB Repo: getGroups");
      return [];
    }
  };
}
