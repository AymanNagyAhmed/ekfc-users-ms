import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { BLOGS_SERVICE } from '@/common/constants/services';
import { RmqModule } from '@/config/rmq/rmq.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '@/modules/users/users.module';

@Module({
  imports: [
    RmqModule.register({ name: BLOGS_SERVICE }),
    AuthModule,
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
