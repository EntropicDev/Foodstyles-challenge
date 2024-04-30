import { db } from "../../config.db";
import { ErrorHandler } from "../../library/error-handler.middleware";
import { GenericRepo } from "../../library/generic.repo";

// Database calls go here
export class GroupRepo extends GenericRepo {
  constructor(model: string, rules: any, db: any) {
    super(model, rules, db);
  }
  addMember = async (id: string, uuid: string): Promise<boolean> => {
    try {
      let group = await this.getOne(id);
      if (group === null) {
        return false;
      }
      await group.addUser(uuid);
      return true;
    } catch (error: any) {
      this.getErrorHandler().passthrough(error, "DB: addMember");
      return false;
    }
  };
  removeMember = async (id: string, uuid: string): Promise<boolean> => {
    try {
      let group = await this.getOne(id);
      if (group === null) {
        return false;
      }
      await group.removeUser(uuid);
      return true;
    } catch (error: any) {
      this.getErrorHandler().passthrough(error, "DB: removeMember");
      return false;
    }
  };
  getMembers = async (id: string): Promise<any[]> => {
    try {
      let group = await this.getOne(id);
      if (group === null) {
        return [];
      }
      return await group.getUsers();
    } catch (error: any) {
      this.getErrorHandler().passthrough(error, "DB: getMembers");
      return [];
    }
  };
}
