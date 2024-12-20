import { Controller, Get, Post, Put, Delete, Param, Body, Req } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Request } from 'express';
import { UsersService } from '@/modules/users/users.service';
import { ApiResponse } from '@/common/interfaces/api-response.interface';
import { User } from '@/modules/users/schemas/user.schema';
import { CreateUserDto } from '@/modules/users/dto/create-user.dto';
import { UpdateUserDto } from '@/modules/users/dto/update-user.dto';
import { ApiResponseUtil } from '@/common/utils/api-response.util';
import { HTTP_STATUS } from '@/common/constants/api.constants';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    async findAll(@Req() req: Request): Promise<ApiResponse<User[]>> {
        const users = await this.usersService.findAll();
        return ApiResponseUtil.success(
            users,
            'Users retrieved successfully',
            req.path
        );
    }

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

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
        @Req() req: Request
    ): Promise<ApiResponse<User>> {
        const user = await this.usersService.updateUser(id, updateUserDto);
        return ApiResponseUtil.success(
            user,
            'User updated successfully',
            req.path
        );
    }

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

    // Message Pattern Handlers
    @MessagePattern({ cmd: 'create_user' })
    async createUser(createUserDto: CreateUserDto): Promise<ApiResponse<User>> {
        const user = await this.usersService.createUser(createUserDto);
        return ApiResponseUtil.success(
            user,
            'User created successfully',
            '/users',
            HTTP_STATUS.CREATED
        );
    }

    @MessagePattern({ cmd: 'get_users' })
    async getUsers(): Promise<ApiResponse<User[]>> {
        const users = await this.usersService.findAll();
        return ApiResponseUtil.success(
            users,
            'Users retrieved successfully',
            '/users'
        );
    }

    @MessagePattern({ cmd: 'get_user' })
    async getUser(data: { id: string }): Promise<ApiResponse<User>> {
        const user = await this.usersService.findUserById(data.id);
        return ApiResponseUtil.success(
            user,
            'User retrieved successfully',
            `/users/${data.id}`
        );
    }

    @MessagePattern({ cmd: 'update_user' })
    async updateUser(data: {
        id: string;
        updateData: UpdateUserDto;
    }): Promise<ApiResponse<User>> {
        const user = await this.usersService.updateUser(data.id, data.updateData);
        return ApiResponseUtil.success(
            user,
            'User updated successfully',
            `/users/${data.id}`
        );
    }

    @MessagePattern({ cmd: 'delete_user' })
    async deleteUser(data: { id: string }): Promise<ApiResponse<void>> {
        await this.usersService.deleteUser(data.id);
        return ApiResponseUtil.success(
            null,
            'User deleted successfully',
            `/users/${data.id}`
        );
    }
}
