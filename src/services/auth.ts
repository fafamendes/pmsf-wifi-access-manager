import bcrypt from "bcryptjs";
import config from 'config';
import jwt from "jsonwebtoken";

export interface JwtToken {
  sub: string;
}

export class AuthService {
  public static async hashPassword(password: string, salt = 10): Promise<string> {
    return await bcrypt.hash(password, salt);
  }

  public static hashPasswordSync(password: string, salt = 10): string {
    return bcrypt.hashSync(password, salt);
  }

  public static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  public static generateToken(sub: string): string {
    return jwt.sign({ sub }, config.get('App.auth.key') as string, {
      expiresIn: config.get('App.auth.tokenExpiresIn')
    });
  }

  public static decodeToken(token: string): JwtToken {
    return jwt.verify(token, config.get('App.auth.key')) as JwtToken;
  }
}