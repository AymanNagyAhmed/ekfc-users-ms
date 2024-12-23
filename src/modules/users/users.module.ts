import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from '@/modules/users/users.controller';
import { UsersService } from '@/modules/users/users.service';
import { User, UserSchema } from '@/modules/users/schemas/user.schema';
import { UsersRepository } from '@/modules/users/users.repository';
import { RmqModule } from '@/config/rmq/rmq.module';
import { BLOGS_SERVICE } from '@/common/constants/services';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),
    RmqModule.register({ name: BLOGS_SERVICE }),

  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
