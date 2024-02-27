import { UserRepository } from '@repositories/user.repository';
import logger from '@src/logger';

export const createDefaultUser = async () => {

  const user = await UserRepository.getUserByUsername(process.env.USER_USERNAME!);
  if (!user) {
    logger.info('Criando usuário ...');
    const newUser = await UserRepository.createUser({
      name: process.env.USER_NAME!,
      username: process.env.USER_USERNAME!,
      password: process.env.USER_PASSWORD!,
      role: 'ADMIN',
      status: true,
    });
    logger.info('Usurário criado com sucesso!', newUser);
  }
  logger.info('Usurário já foi criado');
}