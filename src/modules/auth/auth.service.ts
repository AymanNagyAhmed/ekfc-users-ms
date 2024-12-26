import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { User } from '@/modules/users/schemas/user.schema';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ApiResponse } from '@/common/interfaces/api-response.interface';
import { UsersService } from '@/modules/users/users.service';
import { ApiResponseUtil } from '@/common/utils/api-response.util';
import { TimeUtil } from '@/common/utils/time.util';

export interface TokenPayload {
  userId: string;
}

interface LoginResponse {
  user: User;
  access_token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<ApiResponse<User>> {
    const user = await this.usersService.createUser(createUserDto);
    return ApiResponseUtil.success(
      user,
      'User created successfully',
      '/auth/register'
    );
  }

  async login(user: User, response: Response): Promise<LoginResponse> {
    const tokenPayload: TokenPayload = {
      userId: user._id.toHexString(),
    };

    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN');
    const expiresInSeconds = TimeUtil.parseDurationToSeconds(expiresIn);

    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + expiresInSeconds);

    const access_token = this.jwtService.sign(tokenPayload);

    response.cookie('Authentication', access_token, {
      httpOnly: true,
      expires,
      sameSite: 'strict',
      path: '/api'
    });

    return {
      user,
      access_token,
    };
  }

  logout(response: Response) {
    response.clearCookie('Authentication', {
      httpOnly: true,
      sameSite: 'strict',
      path: '/api'
    });
  }

  async validateUser(authentication: string): Promise<User> {
    const payload = this.jwtService.verify(authentication);
    return this.usersService.findOne(payload.userId);
  }
}