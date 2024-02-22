import { AuthService } from "@src/services/auth";
import { NextFunction, Request, Response } from "express";

export function authMiddleware(req: Partial<Request>, res: Partial<Response>, next: NextFunction): void {
  if (!req.headers?.authorization) {
    res.status?.(401).send({ code: 401, error: 'Unauthorized' });
  } else {
    const token = req.headers?.authorization?.split(' ')[1];
    if (!token) {
      res.status?.(401).send({ code: 401, error: 'Unauthorized - Incorrect token!' });
    } else {
      try {
        const decoded = AuthService.decodeToken(token as string);
        req.context = { userId: decoded.sub };
        next();
      } catch (error: any) {
        res.status?.(401).send({ code: 401, error: 'Unauthorized - Invalid token!' });
      }
    }
  }
}