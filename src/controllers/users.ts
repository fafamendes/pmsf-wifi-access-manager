import { Controller, Delete, Get, Middleware, Post, Put } from '@overnightjs/core';
import { Request, Response } from 'express';

import { UserRepository } from '@repositories/user.repository'

import { BaseController } from '.';
import { AuthService } from '@src/services/auth';
import { authMiddleware } from '@src/middlewares/auth';

@Controller('users')
export class UsersController extends BaseController {

  @Post('')
  @Middleware(authMiddleware)
  public async createUser(req: Request, res: Response): Promise<void> {
    const userId = req.context?.userId;
    const loggedUser = await UserRepository.getById(userId!);
    if (loggedUser?.role !== 'ADMIN') {
      console.log('Não é admin')
      res.status(401).send({ message: 'Unauthorized' });

    }

    const user = await UserRepository.getUserByUsername(req.body.username);
    if (user) {
      res.status(200).send({ message: 'User already exists' })
      res.end();
    };

    try {
      const user = await UserRepository.createUser(req.body)

      res.send({ success: true, user }).end();
    } catch (error: Error | any) {
      console.log(error)
    }
    res.status(401);
  }

  @Post('login')
  public async login(req: Request, res: Response): Promise<void> {
    try {
      const user = await UserRepository.getUserByUsername(req.body.username)
      if (!user) {
        res.status(401).send({ message: 'User not found' })
      } else {
        if (await AuthService.comparePassword(req.body.password, user.password)) {
          const token = AuthService.generateToken(user.id!);
          res.send({ token, user });
        } else {
          res.status(401).send({ message: 'Invalid password' })
        }
      }
    } catch (error: Error | any) {
      console.log(error)
    }
  }


  @Get(':id')
  @Middleware(authMiddleware)
  public async getUser(req: Request, res: Response): Promise<void> {

  }

  @Post('users_count')
  @Middleware(authMiddleware)
  public async getNumberOfUsers(req: Request, res: Response): Promise<void> {
    const userId = req.context?.userId;
    console.log(userId)
    const loggedUser = await UserRepository.getById(userId!);
    try {
      if (!userId) {
        res.status(401).send({ message: 'Token is not provided' });
      }
      if (loggedUser?.role !== 'ADMIN') {
        res.status(401).send({ message: 'Unauthorized' });
      } else {
        const usersCount = await UserRepository.getUsersCount();
        res.status(200).send({ usersCount });
      }
    } catch (error: Error | any) {
      console.log(error)
    }
  }

  @Delete(':id')
  @Middleware(authMiddleware)
  public async deleteUser(req: Request, res: Response): Promise<void> {
    const userId = req.context?.userId;
    const user = await UserRepository.getById(req.params.id);

    if (!user) {
      res.status(404).send({ message: 'User not found' });
    }
    if (user?.role === 'ADMIN' || userId === user?.id) {
      await UserRepository.deleteUser(req.params.id);
      res.send({ success: true });
    }
    res.status(401).send({ message: 'Unauthorized' });
  }

  @Put(':id')
  @Middleware(authMiddleware)
  public async updateUser(req: Request, res: Response): Promise<void> {
    const userId = req.context?.userId;

    const user = await UserRepository.getById(req.params.id);

    if (!user) {
      res.status(404).send({ message: 'User not found' });
    }

    if (user?.role === 'ADMIN' || userId === user?.id) {
      await UserRepository.updateUser(req.params.id, req.body);
      res.send({ success: true });
    }
    res.status(401).send({ message: 'Unauthorized' });
  }

  @Post('verify')
  public async verifyUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await UserRepository.getUserByUsername(req.body.username)
      if (!user) {
        res.status(404).send(false)
      } else {
        if (await AuthService.comparePassword(req.body.password, user.password)) {
          if (user.status)
            res.send(true);
          else
            res.status(401).send(false)
        } else {
          res.status(401).send(false)
        }
      }
    } catch (error: Error | any) {
      console.log(error)
    }
  }

}

