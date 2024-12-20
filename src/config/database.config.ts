import { ConfigService } from '@nestjs/config';
import { MongooseModuleFactoryOptions } from '@nestjs/mongoose';

/**
 * Creates MongoDB connection configuration
 * @param configService NestJS Config Service instance
 * @returns MongoDB connection options
 */
export const databaseConfigOptions = async (
  configService: ConfigService,
): Promise<MongooseModuleFactoryOptions> => {
  const dbType = configService.get<string>('DB_TYPE', 'mongodb');
  const dbUser = configService.get<string>('DB_USER', 'admin');
  const dbPassword = configService.get<string>('DB_PASSWORD', 'admin');
  const dbHost = configService.get<string>('DB_HOST', 'localhost');
  const dbPort = configService.get<string>('DB_PORT', '27017');
  const dbName = configService.get<string>('DB_NAME', 'users_ms_db');

  const uri = `${dbType}://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}?authSource=admin&retryWrites=true&w=majority&directConnection=true`;

  return {
    uri,
    autoCreate: true,
  };
};