import { SetupServer } from './server';
import logger from './logger';
import config from 'config';

enum ExitStatus {
  Failure = 1,
  Success = 0,
}

(
  async (): Promise<void> => {
    try {
      const server = new SetupServer(config.get('App.port'));
      await server.init();
      server.start();
    } catch (error) {
      logger.error(`App exited with error: ${error}`);
      process.exit(ExitStatus.Failure);
    }
  }
)();