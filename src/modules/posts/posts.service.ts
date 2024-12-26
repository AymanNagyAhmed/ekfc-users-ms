import { Inject, Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { BLOGS_SERVICE } from '@/common/constants/services';
import { firstValueFrom, catchError } from 'rxjs';
import { ResourceNotFoundException } from '@/common/exceptions/resource-not-found.exception';
import { InvalidInputException } from '@/common/exceptions/invalid-input.exception';

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);

  constructor(
    @Inject(BLOGS_SERVICE) private readonly blogsClient: ClientProxy
  ) {}

  async createPost(createPostDto: CreatePostDto, userId: string) {
    try {
      // Create the complete post data
      const postData = {
        ...createPostDto,
        userId
      };

      this.logger.debug('Sending create post request with data:', postData);

      return await firstValueFrom(
        this.blogsClient.send(
          { cmd: 'create_post' }, 
          postData // Send the complete post data
        ).pipe(
          catchError(error => {
            this.logger.error('Error creating post:', error);
            if (error?.status === 401 || error?.message?.includes('unauthorized')) {
              throw new UnauthorizedException(error.message);
            }
            throw error;
          })
        )
      );
    } catch (error) {
      this.logger.error('Error in createPost:', error);
      throw error;
    }
  }

  async findAll(userId: string) {
    return firstValueFrom(
      this.blogsClient.send(
        { cmd: 'get_posts' }, 
        { userId }
      ).pipe(
        catchError(error => {
          if (error.message.includes('unauthorized')) {
            throw new UnauthorizedException(error.message);
          }
          throw error;
        })
      )
    );
  }

  async getPost(id: string, userId: string) {
    try {
      return await firstValueFrom(
        this.blogsClient.send(
          { cmd: 'get_post' }, 
          { id, userId }
        ).pipe(
          catchError(error => {
            this.logger.error('Error from blogs service:', error);
            
            // Handle specific error types based on the error message or status
            if (error?.status === 401 || error?.message?.includes('unauthorized')) {
              throw new UnauthorizedException(error.message);
            }
            
            if (error?.status === 404 || error?.message?.includes('not found')) {
              throw new ResourceNotFoundException('Post not found');
            }

            if (error?.message?.includes('Invalid') || error?.message?.includes('format')) {
              throw new InvalidInputException(error.message);
            }

            // Log unexpected errors
            this.logger.error('Unexpected error:', error);
            throw new Error('Failed to retrieve post');
          })
        )
      );
    } catch (error) {
      this.logger.error('Error in getPost:', error);
      
      // Rethrow specific exceptions
      if (error instanceof UnauthorizedException || 
          error instanceof ResourceNotFoundException ||
          error instanceof InvalidInputException) {
        throw error;
      }

      // Handle unexpected errors
      throw new Error('Failed to retrieve post');
    }
  }

  async updatePost(id: string, updatePostDto: UpdatePostDto, userId: string) {
    try {
      return await firstValueFrom(
        this.blogsClient.send(
          { cmd: 'update_post' }, 
          { id, updateData: updatePostDto, userId }
        ).pipe(
          catchError(error => {
            this.logger.error('Error from blogs service:', error);
            
            // Handle specific error types based on the error message or status
            if (error?.status === 401 || error?.message?.includes('unauthorized')) {
              throw new UnauthorizedException(error.message);
            }
            
            if (error?.status === 404 || error?.message?.includes('not found')) {
              throw new ResourceNotFoundException('Post not found');
            }

            if (error?.message?.includes('Invalid') || error?.message?.includes('format')) {
              throw new InvalidInputException(error.message);
            }

            // Log unexpected errors
            this.logger.error('Unexpected error:', error);
            throw new Error('Failed to update post');
          })
        )
      );
    } catch (error) {
      this.logger.error('Error in updatePost:', error);
      
      // Rethrow specific exceptions
      if (error instanceof UnauthorizedException || 
          error instanceof ResourceNotFoundException ||
          error instanceof InvalidInputException) {
        throw error;
      }

      // Handle unexpected errors
      throw new Error('Failed to update post');
    }
  }

  async deletePost(id: string, userId: string) {
    try {
      return await firstValueFrom(
        this.blogsClient.send(
          { cmd: 'delete_post' }, 
          { id, userId }
        ).pipe(
          catchError(error => {
            this.logger.error('Error from blogs service:', error);
            
            // Handle specific error types based on the error message or status
            if (error?.status === 401 || error?.message?.includes('unauthorized')) {
              throw new UnauthorizedException(error.message);
            }
            
            if (error?.status === 404 || error?.message?.includes('not found')) {
              throw new ResourceNotFoundException('Post not found');
            }

            if (error?.message?.includes('Invalid') || error?.message?.includes('format')) {
              throw new InvalidInputException(error.message);
            }

            // Log unexpected errors
            this.logger.error('Unexpected error:', error);
            throw new Error('Failed to delete post');
          })
        )
      );
    } catch (error) {
      this.logger.error('Error in deletePost:', error);
      
      // Rethrow specific exceptions
      if (error instanceof UnauthorizedException || 
          error instanceof ResourceNotFoundException ||
          error instanceof InvalidInputException) {
        throw error;
      }

      // Handle unexpected errors
      throw new Error('Failed to delete post');
    }
  }
}
