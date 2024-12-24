import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { BLOGS_SERVICE } from '@/common/constants/services';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PostsService {
  constructor(
    @Inject(BLOGS_SERVICE) private readonly blogsClient: ClientProxy
  ) {}

  async createPost(createPostDto: CreatePostDto) {
    return firstValueFrom(
      this.blogsClient.send({ cmd: 'create_post' }, createPostDto)
    );
  }

  async findAll() {
    return firstValueFrom(
      this.blogsClient.send({ cmd: 'get_posts' }, {})
    );
  }

  async getPost(id: string) {
    return firstValueFrom(
      this.blogsClient.send({ cmd: 'get_post' }, { id })
    );
  }

  async updatePost(id: string, updatePostDto: UpdatePostDto) {
    return firstValueFrom(
      this.blogsClient.send(
        { cmd: 'update_post' }, 
        { id, updateData: updatePostDto }
      )
    );
  }

  async deletePost(id: string) {
    return firstValueFrom(
      this.blogsClient.send({ cmd: 'delete_post' }, { id })
    );
  }
}
