import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseConfig } from '@/common/interfaces/database-config.interface';


@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const dbConfig: DatabaseConfig = {
          type: configService.get<string>('DB_TYPE'),
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          database: configService.get<string>('DB_NAME'),
          username: configService.get<string>('DB_USER'),
          password: configService.get<string>('DB_PASSWORD'),
        };
        let uri = `${dbConfig.type}://${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`;

        if(configService.get<string>('NODE_ENV') === 'development'){
           let uri = `${dbConfig.type}://${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`;
        }else{
           let uri = `${dbConfig.type}://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`;
        }


        return {
          uri,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
