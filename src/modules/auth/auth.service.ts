import { ErrorHandler } from "../../library/error-handler.middleware";
import { HTTP } from "../../library/http";
import {
  API_KEY,
  API_KEY_JWT_SECRET,
  AUTH_API_KEY,
  AUTH_JWT_SECRET,
  JWT_SECRET,
} from "./auth.config";
import { CustomError } from "../../library/custom-error";
import { JWT } from "../../library/jwt";
import { APIKey } from "../../library/api-key";
const bcrypt = require("bcryptjs");
export class AuthService {
  private errorHandler: ErrorHandler = new ErrorHandler();
  private http: HTTP = new HTTP();
  private jwt: JWT = new JWT();
  private apiKey: APIKey = new APIKey();

  private isExpired = (expiry: number): boolean => {
    return expiry < Date.now();
  };

  localLogin = async (email: string, pwd: string) => {
    try {
      let user: any = await this.http.get(
        `/users/pwd/${email}`,
        await this.apiKey.tokeniseSuperUser(
          API_KEY,
          AUTH_API_KEY,
          await this.generateKey(AUTH_API_KEY)
        ),
        true
      );
      if (bcrypt.compareSync(pwd, user.pwd)) {
        const data = {
          uuid: user.id,
          email: user.email,
          name: user.name,
          surname: user.surname,
        };
        return {
          ...data,
          jwt: this.jwt.create(data),
        };
      } else {
        throw new CustomError("Invalid details", 401, {});
      }
    } catch (error: any) {
      console.log(error);
      this.errorHandler.passthrough(error, "Service: localLogin");
    }
  };
  // loginViaOTP = async (otp: OneTimePin): Promise<string | boolean> => {
  //   try {
  //     if (await this.OTPService.isValid(otp)) {
  //       let user: User | null = null;
  //       if (otp.email !== null && otp.email !== undefined) {
  //         user = await this.userRepo.getByField("email", otp.email);
  //       } else if (otp.cell !== null && otp.cell !== undefined) {
  //         user = await this.userRepo.getByField("cell", otp.email);
  //       }
  //       if (user !== null) {
  //         return await this.createJWT(
  //           {
  //             name: user.name,
  //             surname: user.surname,
  //             email: user.email,
  //             uuid: user.id,
  //           },
  //           86400
  //         );
  //       }
  //     }
  //     return false;
  //   } catch (error: any) {
  //     this.errorHandler.passthrough(error, "Auth Service: loginViaOTP");
  //     return false;
  //   }
  // };

  // loginWithAzure = async (data: any): Promise<string> => {
  //   try {
  //     const userData = await this.azureService.verifyAzureAdToken(data.token);
  //     let user: User | null = await this.userRepo.getByField(
  //       "email",
  //       userData["preferred_username"]
  //     );

  //     if (user === null) {
  //       //TODO Test how to manage no cell number.
  //       user = await this.userRepo.create({
  //         name: userData["name"].split(" ")[0],
  //         surname:
  //           userData["name"].split(" ")[userData["name"].split(" ").length - 1],
  //         email: userData["preferred_username"],
  //       });
  //     } else if (user.authProviderId === null) {
  //       // Update the user login type
  //       user = await this.userRepo.update(user.id, {
  //         authProviderId: 1,
  //       });
  //     }
  //     return await this.createJWT(
  //       {
  //         name: user!.name,
  //         surname: user!.surname,
  //         email: user!.email,
  //         uuid: user!.id,
  //       },
  //       86400
  //     );
  //   } catch (error: any) {
  //     this.errorHandler.passthrough(error, "Auth Service: login");
  //     return "";
  //   }
  // };
  // createJWT = async (payload: any, duration: number): Promise<string> => {
  //   try {
  //     return jwt.sign(
  //       {
  //         exp: Math.floor(Date.now() / 1000) + jwtExpiration!,
  //         data: payload,
  //       },
  //       jwtSecret
  //     );
  //   } catch (error: any) {
  //     this.errorHandler.passthrough(error, "Auth Service: createJWT");
  //     return "";
  //   }
  // };
  private generateKey = async (authToken: string) => {
    return await bcrypt.hash(
      authToken +
        JWT_SECRET +
        AUTH_API_KEY +
        API_KEY_JWT_SECRET +
        AUTH_JWT_SECRET +
        authToken,
      10
    );
  };
  private keyCheck = async (key: string, authToken: string) => {
    return await bcrypt.compareSync(
      authToken +
        JWT_SECRET +
        AUTH_API_KEY +
        API_KEY_JWT_SECRET +
        AUTH_JWT_SECRET +
        authToken,
      key
    );
  };
  hasPermission = async (authToken: string, fxn: string): Promise<any> => {
    try {
      let decodedToken = this.jwt.verify(authToken.replace("Bearer ", ""));
      if (!decodedToken) {
        decodedToken = this.jwt.verify(
          authToken.replace("Bearer ", ""),
          API_KEY_JWT_SECRET
        );
        if (!decodedToken) {
          decodedToken = this.jwt.verify(
            authToken.replace("Bearer ", ""),
            AUTH_JWT_SECRET
          );
          if (!decodedToken) {
            return false;
          } else {
            console.log("Super User Key Used");
            if (decodedToken.data.super) {
              if (
                !(await this.keyCheck(
                  decodedToken.data.key,
                  decodedToken.data.authToken
                ))
              ) {
                return false;
              }
              return true;
            }
            return false;
          }
        } else {
          console.log("API Key Used");
        }
      } else {
        console.log("User Key Used");
      }
      let uuid = decodedToken.data.uuid;
      let groups = await this.http.get(
        `/users/${uuid}/groups`,
        await this.apiKey.tokeniseSuperUser(
          API_KEY,
          authToken,
          await this.generateKey(authToken)
        ),
        true
      );
      let groupList: string = "";
      if (groups.length === 0) {
        return false;
      }
      if (groups.length === 1) {
        groupList = `${groups[0].id}`;
      } else {
        groupList = `${groups[0].id}`;
        groups.forEach((group: any) => {
          groupList += `,${group.id}`;
        });
      }
      let permissions = await this.http.get(
        `/groups/${groupList}/permissions`,
        await this.apiKey.tokeniseSuperUser(
          API_KEY,
          authToken,
          await this.generateKey(authToken)
        ),
        true
      );
      let hasPermission = [];
      hasPermission = permissions.find((perm: any) => perm.function === fxn);
      if (hasPermission.length === 0) {
        return false;
      } else {
        return {
          ...decodedToken.data,
          outcome: true,
          fxn: fxn,
        };
      }
    } catch (error: any) {
      return false;
    }
  };
}
