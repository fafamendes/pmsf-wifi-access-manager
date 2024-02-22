import './utils/module-alias';
import { Server } from '@overnightjs/core';
import { Application } from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import * as http from 'http';

import { UsersController } from './controllers/users';

import logger from './logger';
import * as database from '@src/database';

export class SetupServer extends Server {
  private server?: http.Server;
  constructor(private port = 3000) {
    super();
  }

  public async init(): Promise<void> {
    this.setupExpress();
    this.setupControllers();
    await this.setupDatabase();
  }

  public getApp(): Application {
    return this.app;
  }

  public async close(): Promise<void> {
    await database.close();
  }

  private async setupDatabase(): Promise<void> {
    await database.connect();
  }
  private setupExpress(): void {
    logger.info('Configurando servidor');
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(morgan('dev'));
  }

  private setupControllers(): void {
    this.addControllers(
      [new UsersController(),]
    );
  }
  public start(): void {
    this.server = this.app.listen(this.port, () => {
      logger.info('Server listening on port: ' + this.port);
    });
  }
}