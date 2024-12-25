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

interface LoginResponse {
  user: User;
  access_token: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register' })
  @SwaggerResponse({ 
    status: 200, 
    description: 'Register successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'User created successfully' },
        path: { type: 'string', example: '/auth/register' },
        timestamp: { type: 'string', example: '2024-12-25T11:12:56.269Z' },
        data: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '676be8b818a1117445990f53' },
            email: { type: 'string', example: 'user10test.com' },
            isEmailVerified: { type: 'boolean', example: false },
            role: { type: 'string', example: 'user' },
            isActive: { type: 'boolean', example: true },
            createdAt: { type: 'string', example: '2024-12-25T11:12:56.249Z' },
            updatedAt: { type: 'string', example: '2024-12-25T11:12:56.249Z' },
            fullName: { type: 'string', example: 'Anonymous User' }
          }
        }
      }
    }
  })
  @SwaggerResponse({ 
    status: 400, 
    description: 'Bad Request - Email already exists',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Email already exists' },
        path: { type: 'string', example: '/api/auth/register' },
        timestamp: { type: 'string', example: '2024-12-25T11:11:58.171Z' }
      }
    }
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user1@test.com' },
        password: { type: 'string', example: '123456789' }
      }
    }
  })
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<ApiResponse<User>> {
    return this.authService.register(createUserDto);
  }

  @ApiOperation({ summary: 'Login' })
  @SwaggerResponse({ 
    status: 200, 
    description: 'Login successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Operation successful' },
        path: { type: 'string', example: '/api/auth/login' },
        timestamp: { type: 'string', example: '2024-12-25T11:03:17.532Z' },
        data: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                _id: { type: 'string', example: '676b215a94d388b8af0154f5' },
                email: { type: 'string', example: 'user1@test.com' },
                password: { type: 'string', example: 'hashed password' },
                isEmailVerified: { type: 'boolean', example: false },
                role: { type: 'string', example: 'user' },
                isActive: { type: 'boolean', example: true },
                createdAt: { type: 'string', example: '2024-12-24T21:02:18.480Z' },
                updatedAt: { type: 'string', example: '2024-12-24T21:02:18.480Z' }
              }
            },
            access_token: { 
              type: 'string', 
              example: 'jwt_token' 
            }
          }
        }
      }
    }
  })
  @SwaggerResponse({ 
    status: 401, 
    description: 'Unauthorized - Invalid credentials',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Invalid email or password' },
        path: { type: 'string', example: '/api/auth/login' },
        timestamp: { type: 'string', example: '2024-12-25T11:09:57.817Z' }
      }
    }
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user1@test.com' },
        password: { type: 'string', example: '123456789' }
      }
    }
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
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
}
