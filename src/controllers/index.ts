import { Response } from 'express';
import { CustomPrismaError } from '@src/types/types';

export abstract class BaseController {
  protected sendErrorResponse(res: Response, error: CustomPrismaError): Response {
    return res.status(400).send({ success: false, message: error.message });
    //to-do: add better error handling
  }
}