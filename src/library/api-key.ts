import { AUTH_JWT_SECRET } from "../modules/auth/auth.config";
import { HTTP } from "./http";
import { JWT } from "./jwt";

export class APIKey {
  private jwt: JWT = new JWT();
  private http: HTTP = new HTTP();
  tokenise = async (apiKey: string) => {
    return await this.http.get(`/apiKeys/${apiKey}/token`, "", true);
  };
  tokeniseSuperUser = async (
    apiKey: string,
    authToken: string,
    key: string
  ) => {
    return this.jwt.create(
      { apiKey, super: true, key, authToken },
      10000,
      AUTH_JWT_SECRET
    );
  };
}
