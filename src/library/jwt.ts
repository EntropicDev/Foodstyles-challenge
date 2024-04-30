const jwtTool = require("jsonwebtoken");
export class JWT {
  create = (
    data: any,
    duration: any = parseInt(process.env.JWT_EXPIRATION as string),
    secret: string = process.env.JWT_SECRET as string
  ) => {
    const payload = {
      exp: Math.floor(Date.now() / 1000) + duration,
      data: data,
    };
    return jwtTool.sign(payload, secret);
  };
  verify = (jwt: string, secret: string = process.env.JWT_SECRET as string) => {
    try {
      return jwtTool.verify(jwt, secret);
    } catch (error) {
      return false;
    }
  };
}
