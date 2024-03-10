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

  @Post('users_details')
  @Middleware(authMiddleware)
  public async getUserDetails(req: Request, res: Response): Promise<void> {
    const userId = req.context?.userId;
    const loggedUser = await UserRepository.getById(userId!);
    if (loggedUser?.role !== 'ADMIN') {
      res.status(401).send({ message: 'Unauthorized' }).end();
    } else {
      const users = await UserRepository.getAllUsers();
      res.send({ success: true, users }).end();
    }
  }

  @Get('me')
  @Middleware(authMiddleware)
  public async getUser(req: Request, res: Response): Promise<void> {
    const userId = req.context?.userId;
    try {
      const user = await UserRepository.getById(userId!);
      res.send({ success: true, user }).end();
    }
    catch (error: Error | any) {
      res.status(401).send({ message: 'Unauthorized', error }).end();
      console.log(error)
    }
  }

  @Get('users_count')
  @Middleware(authMiddleware)
  public async getNumberOfUsers(req: Request, res: Response): Promise<void> {
    const userId = req.context?.userId;
    const loggedUser = await UserRepository.getById(userId!);
    try {
      if (!userId) {
        res.status(401).send({ message: 'Token is not provided' }).end();
      }
      if (loggedUser?.role !== 'ADMIN') {
        res.status(401).send({ message: 'Unauthorized' }).end();
      } else {

        const usersCount = await UserRepository.getUsersCount();
        res.send({ success: true, usersCount }).end();
      }
    } catch (error: Error | any) {
      console.log(error)
    }
  }

  @Get('like_username/:username/:limit')
  @Middleware(authMiddleware)
  public async getLikeUsername(req: Request, res: Response): Promise<void> {
    const userId = req.context?.userId;
    const loggedUser = await UserRepository.getById(userId!);
    if (loggedUser?.role !== 'ADMIN') {
      res.status(401).send({ error: true, message: 'Unauthorized' });
    } else {
      try {
        const users = await UserRepository.getLikeUsername(req.params.username, parseInt(req.params.limit), userId!);
        res.send({ success: true, users }).end();
      } catch (error: Error | any) {
        console.log(error)
      }
    }
  }


  @Get('like_name/:name/:limit')
  @Middleware(authMiddleware)
  public async getLikeName(req: Request, res: Response): Promise<void> {
    const userId = req.context?.userId;
    const loggedUser = await UserRepository.getById(userId!);
    if (loggedUser?.role !== 'ADMIN') {
      res.status(401).send({ error: true, message: 'Unauthorized' });
    } else {
      try {
        const users = await UserRepository.getLikeName(req.params.name, parseInt(req.params.limit), userId!);
        res.send({ success: true, users }).end();
      } catch (error: Error | any) {
        console.log(error)
      }
    }
  }

  @Get('search/:search_string/:limit')
  @Middleware(authMiddleware)
  public async searchUsers(req: Request, res: Response): Promise<void> {
    const userId = req.context?.userId;
    const loggedUser = await UserRepository.getById(userId!);
    if (loggedUser?.role !== 'ADMIN') {
      res.status(401).send({ error: true, message: 'Unauthorized' });
    }
    else {
      try {
        
        const users = [
          ...await UserRepository.getLikeName(req.params.search_string, parseInt(req.params.limit), userId!),
          ...await UserRepository.getLikeUsername(req.params.search_string, parseInt(req.params.limit), userId!)
        ];
    
        res.send({ success: true, users }).end();
      } catch (error: Error | any) {
        console.log(error)
        res.status(500).send({ error: true, message: 'Internal server error' });
      }
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

