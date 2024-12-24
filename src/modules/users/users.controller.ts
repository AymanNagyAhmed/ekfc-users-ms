import { Controller, Get, Post, Put, Delete, Param, Body, Req, Patch } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from '@/modules/users/users.service';
import { ApiResponse } from '@/common/interfaces/api-response.interface';
import { User } from '@/modules/users/schemas/user.schema';
import { CreateUserDto } from '@/modules/users/dto/create-user.dto';
import { UpdateUserDto } from '@/modules/users/dto/update-user.dto';
import { ApiResponseUtil } from '@/common/utils/api-response.util';
import { HTTP_STATUS } from '@/common/constants/api.constants';
import { ApiTags, ApiOperation, ApiResponse as SwaggerResponse } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @ApiOperation({ summary: 'Get all users' })
    @SwaggerResponse({ 
      status: 200, 
      description: 'List of all users retrieved successfully' 
    })
    @Get()
    async findAll(@Req() req: Request): Promise<ApiResponse<User[]>> {
        const users = await this.usersService.findAll();
        return ApiResponseUtil.success(
            users,
            'Users retrieved successfully',
            req.path
        );
    }

    @ApiOperation({ summary: 'Create new user' })
    @SwaggerResponse({ 
      status: 201, 
      description: 'User created successfully' 
    })
    @Post()
    async create(
        @Body() createUserDto: CreateUserDto,
        @Req() req: Request
    ): Promise<ApiResponse<User>> {
        const user = await this.usersService.createUser(createUserDto);
        return ApiResponseUtil.success(
            user,
            'User created successfully',
            req.path,
            HTTP_STATUS.CREATED
        );
    }

    @ApiOperation({ summary: 'Get user by ID' })
    @SwaggerResponse({ 
      status: 200, 
      description: 'User retrieved successfully' 
    })
    @SwaggerResponse({ 
      status: 404, 
      description: 'User not found' 
    })
    @Get(':id')
    async findOne(
        @Param('id') id: string,
        @Req() req: Request
    ): Promise<ApiResponse<User>> {
        const user = await this.usersService.findUserById(id);
        return ApiResponseUtil.success(
            user,
            'User retrieved successfully',
            req.path
        );
    }

    @ApiOperation({ summary: 'Update user by ID' })
    @SwaggerResponse({ 
      status: 200, 
      description: 'User updated successfully' 
    })
    @SwaggerResponse({ 
      status: 404, 
      description: 'User not found' 
    })
    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
        @Req() req: Request
    ): Promise<ApiResponse<User>> {
        try {
            const cleanUpdateDto = Object.entries(updateUserDto)
                .reduce((acc, [key, value]) => {
                    if (value !== undefined && value !== null) {
                        acc[key] = value;
                    }
                    return acc;
                }, {});            
            const user = await this.usersService.updateUser(id, cleanUpdateDto);
            
            return ApiResponseUtil.success(
                user,
                'User updated successfully',
                req.path
            );
        } catch (error) {
            console.error('Update error:', error);
            throw error;
        }
    }

    @ApiOperation({ summary: 'Patch user by ID' })
    @SwaggerResponse({ 
      status: 200, 
      description: 'User updated successfully' 
    })
    @SwaggerResponse({ 
      status: 404, 
      description: 'User not found' 
    })
    @Patch(':id')
    async patch(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
        @Req() req: Request
    ): Promise<ApiResponse<User>> {
        return this.update(id, updateUserDto, req);
    }

    @ApiOperation({ summary: 'Delete user by ID' })
    @SwaggerResponse({ 
      status: 200, 
      description: 'User deleted successfully' 
    })
    @SwaggerResponse({ 
      status: 404, 
      description: 'User not found' 
    })
    @Delete(':id')
    async remove(
        @Param('id') id: string,
        @Req() req: Request
    ): Promise<ApiResponse<void>> {
        await this.usersService.deleteUser(id);
        return ApiResponseUtil.success(
            null,
            'User deleted successfully',
            req.path
        );
    }


}
