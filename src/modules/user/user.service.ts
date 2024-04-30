import { UserRepo } from "./user.repo";
import { CustomError } from "../../library/custom-error";
import { ErrorHandler } from "../../library/error-handler.middleware";
import { User } from "./user";
import { HTTP } from "../../library/http";
import { APIKey } from "../../library/api-key";

const bcrypt = require("bcryptjs");
export class UserService {
  constructor(private genericRepo: any) {}
  private http: HTTP = new HTTP();
  private apiKey: APIKey = new APIKey();
  userRepo = new UserRepo(
    this.genericRepo.getModel(),
    this.genericRepo.getRules(),
    this.genericRepo.getDB()
  );
  errorHandler: ErrorHandler = new ErrorHandler();
  create = async (data: User): Promise<User> => {
    try {
      if (!(await this.userRepo.emailExists(data.email))) {
        data.pwd = await bcrypt.hash(data.pwd, 10);
        return await this.genericRepo.create(data);
      } else {
        throw new CustomError("User already exists", 400, {
          email: data.email,
        });
      }
    } catch (error: any) {
      throw new CustomError(error.message, error.status, error.additionalInfo);
    }
  };
  cellphoneExists = async (cell: string): Promise<Boolean> => {
    try {
      let user = await this.genericRepo.getByField("cell", cell);
      if (user) {
        return true;
      }
      return false;
    } catch (error: any) {
      this.errorHandler.passthrough(error, "Service: cellphoneExists");
      return false;
    }
  };
}
