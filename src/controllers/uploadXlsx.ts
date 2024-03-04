import { Controller, Middleware, Post } from "@overnightjs/core";
import { Request, Response } from "express";
import { BaseController } from ".";

import { upload } from "@src/middlewares/xlsxMulter";
import { UserRepository } from "@repositories/user.repository";
import { getUsersExcel } from "@src/utils/getUsersExcel";
import { authMiddleware } from "@src/middlewares/auth";

@Controller('upload-xlsx')
export class UploadXlsxController extends BaseController {
  @Post('')
  @Middleware([authMiddleware, upload.single('xlsx')])
  async uploadXlsx(req: Request, res: Response): Promise<void> {
    const userId = req.context?.userId;
    const loggedUser = await UserRepository.getById(userId!);
    if (loggedUser?.role !== 'ADMIN') {
      res.status(401).send({ message: 'Unauthorized' });
    } else {
      try {
        const users = await getUsersExcel(req.file?.path!);
        await UserRepository.createManyUsers(users);

        res.send({ success: true }).end();
      } catch (error: Error | any) {
        console.log(error)
      }
    }
  }
}