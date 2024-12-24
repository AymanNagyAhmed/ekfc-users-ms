import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { BLOGS_SERVICE } from '@/common/constants/services';
import { RmqModule } from '@/config/rmq/rmq.module';

@Module({
  imports: [
    RmqModule.register({ name: BLOGS_SERVICE }),
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
