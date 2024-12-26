import { Controller, Get, Body, Patch, Param, Delete, UseGuards, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiSecurity, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { User } from './schemas/user.schema';

// Define a reusable response schema object
const userResponseProperties = {
  _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
  firstName: { type: 'string', example: 'John' },
  lastName: { type: 'string', example: 'Doe' },
  email: { type: 'string', example: 'john.doe@example.com' },
  isEmailVerified: { type: 'boolean', example: true },
  role: { type: 'string', example: 'user' },
  phoneNumber: { type: 'string', example: '+1234567890' },
  isActive: { type: 'boolean', example: true },
  fullName: { type: 'string', example: 'John Doe' },
  createdAt: { type: 'string', example: '2024-03-20T10:00:00.000Z' },
  updatedAt: { type: 'string', example: '2024-03-20T10:00:00.000Z' }
};

// Add this response schema for unauthorized
const unauthorizedResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: false },
    statusCode: { type: 'number', example: 401 },
    message: { type: 'string', example: 'You are not authorized to access this resource' },
    path: { type: 'string', example: '/users' },
    timestamp: { type: 'string', example: '2024-03-20T10:00:00.000Z' }
  }
};

@ApiTags('3. Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiSecurity('bearer')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Users retrieved successfully' },
        path: { type: 'string', example: '/users' },
        timestamp: { type: 'string', example: '2024-03-20T10:00:00.000Z' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: userResponseProperties
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized',
    schema: unauthorizedResponseSchema
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'Profile retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Profile retrieved successfully' },
        path: { type: 'string', example: '/users/profile' },
        timestamp: { type: 'string', example: '2024-03-20T10:00:00.000Z' },
        data: {
          type: 'object',
          properties: userResponseProperties
        }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized',
    schema: unauthorizedResponseSchema
  })
  getProfile(@CurrentUser() user: User) {
    return this.usersService.findOne(user._id.toString());
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiBody({
    description: 'User update fields',
    schema: {
      type: 'object',
      properties: {
        firstName: { type: 'string', example: 'John' },
        lastName: { type: 'string', example: 'Doe' },
        email: { type: 'string', example: 'john.doe@example.com' },
        phoneNumber: { type: 'string', example: '+1234567890' }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'User updated successfully' },
        path: { type: 'string', example: '/users/:id' },
        timestamp: { type: 'string', example: '2024-03-20T10:00:00.000Z' },
        data: {
          type: 'object',
          properties: userResponseProperties
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized',
    schema: unauthorizedResponseSchema
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: User
  ) {
    if (id !== currentUser._id.toString()) {
      throw new UnauthorizedException('You can only update your own profile');
    }
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'User deleted successfully' },
        path: { type: 'string', example: '/users/:id' },
        timestamp: { type: 'string', example: '2024-03-20T10:00:00.000Z' },
        data: {
          type: 'object',
          properties: userResponseProperties
        }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized',
    schema: unauthorizedResponseSchema
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  remove(
    @Param('id') id: string,
    @CurrentUser() currentUser: User
  ) {
    if (id !== currentUser._id.toString()) {
      throw new UnauthorizedException('You can only delete your own profile');
    }
    return this.usersService.deleteUser(id);
  }
}
