import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '@/modules/users/users.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { validationSchema } from '@/config/env.validation';
import { DatabaseModule } from '@/config/database/database.module';
import { RmqModule } from '@/config/rmq/rmq.module';
import { BLOGS_SERVICE } from '@/common/constants/services';

@Module({
  imports: [
    // Load and validate environment variables
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema
    }),
    
    // Database configuration
    DatabaseModule,

    // Feature modules
    UsersModule,
    AuthModule,

    // RabbitMQ configuration
    RmqModule.register({ name: BLOGS_SERVICE }),
    
  ],
})
export class AppModule {}
