import { Permission } from "./permission.model";
import { db } from "../../config.db";
import { GenericRepo } from "../../library/generic.repo";

// Database calls go here
export class PermissionRepo extends GenericRepo {
  getPermission = async (uuid: string, fxn: string): Promise<Permission> => {
    return await db.Permission.findOne({
      where: {
        function: fxn,
      },
      include: [
        {
          model: db.Group,
          required: true,
          include: [
            {
              model: db.User,
              where: {
                id: uuid,
              },
            },
          ],
        },
      ],
    });
  };
}
