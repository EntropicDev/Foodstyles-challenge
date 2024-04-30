import { CustomError } from "../../library/custom-error";
import { ErrorHandler } from "../../library/error-handler.middleware";
import { GroupRepo } from "./group.repo";

export class GroupService {
  constructor(private genericRepo: any) {}
  groupRepo = new GroupRepo(
    this.genericRepo.getModel(),
    this.genericRepo.getRules(),
    this.genericRepo.getDB()
  );
  errorHandler: ErrorHandler = new ErrorHandler();

  getGroupsPermissions = async (groupIdList: string[]): Promise<any[]> => {
    try {
      let permissions: any[] = [];
      for (let i = 0; i < groupIdList.length; i++) {
        const groupId = groupIdList[i];
        let group = await this.groupRepo.getOne(groupId);
        if (group !== null) {
          permissions = permissions.concat(await group.getPermissions());
        }
      }
      return permissions;
    } catch (error: any) {
      this.errorHandler.passthrough(error, "Service: getGroupsPermissions");
      return [];
    }
  };
}
