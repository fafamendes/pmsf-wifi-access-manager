import { Response } from 'express';

export abstract class BaseController {
  protected sendErrorResponse(res: Response, error: Error | any): Response {
    return res.status(400).send({ success: false, message: error.message });
    //to-do: add better error handling
  }
}