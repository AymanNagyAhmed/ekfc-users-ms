import { Controller, Post, UseGuards, Res, Get, Body, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from '@/modules/auth/auth.service';
import { LocalAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { User } from '@/modules/users/schemas/user.schema';
import { ApiTags, ApiOperation, ApiResponse as SwaggerResponse, ApiSecurity, ApiBody } from '@nestjs/swagger';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ApiResponse } from '@/common/interfaces/api-response.interface';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { MessagePattern } from '@nestjs/microservices';

interface LoginResponse {
  user: User;
  access_token: string;
}

@ApiTags('2. Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  @SwaggerResponse({ 
    status: 201, 
    description: 'User registered successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 201 },
        message: { type: 'string', example: 'User registered successfully' },
        path: { type: 'string', example: '/auth/register' },
        timestamp: { type: 'string', example: '2024-12-25T11:00:00.000Z' },
        data: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                _id: { type: 'string' },
                email: { type: 'string' },
                isEmailVerified: { type: 'boolean' },
                role: { type: 'string' },
                isActive: { type: 'boolean' },
                createdAt: { type: 'string' },
                updatedAt: { type: 'string' }
              }
            }
          }
        }
      }
    }
  })
  async register(@Body() createUserDto: CreateUserDto): Promise<ApiResponse<User>> {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @SwaggerResponse({ 
    status: 200, 
    description: 'Login successful',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Login successful' },
        path: { type: 'string', example: '/auth/login' },
        timestamp: { type: 'string', example: '2024-12-25T11:00:00.000Z' },
        data: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                _id: { type: 'string' },
                email: { type: 'string' },
                role: { type: 'string' }
              }
            },
            access_token: { type: 'string' }
          }
        }
      }
    }
  })
  @UseGuards(LocalAuthGuard)
  async login(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResponse> {
    return this.authService.login(user, response);
  }

  @ApiOperation({ summary: 'Logout current user' })
  @SwaggerResponse({ 
    status: 200, 
    description: 'Logout successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Operation successful' },
        path: { type: 'string', example: '/api/auth/logout' },
        timestamp: { type: 'string', example: '2024-12-25T11:01:37.650Z' },
        data: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Successfully logged out' }
          }
        }
      }
    }
  })
  @SwaggerResponse({ 
    status: 401, 
    description: 'Unauthorized - User not authenticated',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'No authentication token provided' },
        path: { type: 'string', example: '/api/auth/logout' },
        timestamp: { type: 'string', example: '2024-12-25T11:00:05.384Z' }
      }
    }
  })
  @ApiSecurity('bearer')
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    this.authService.logout(response);
    return { message: 'Successfully logged out' };
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern({ cmd: 'validate_user' })
  async validateUser(@CurrentUser() user: User): Promise<User> {
    return user;
  }
}
