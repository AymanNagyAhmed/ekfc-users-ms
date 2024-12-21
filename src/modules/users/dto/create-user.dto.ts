import { IsString, IsEmail, IsOptional, IsBoolean, IsArray, IsEnum, Matches } from 'class-validator';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

export class CreateUserDto {
  @IsOptional()
  @IsString()
  readonly firstName?: string;

  @IsOptional()
  @IsString()
  readonly lastName?: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message: 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter and one number'
  })
  readonly password: string;

  @IsOptional()
  @IsBoolean()
  readonly isEmailVerified?: boolean;

  @IsOptional()
  @IsEnum(UserRole)
  readonly role?: UserRole;

  @IsOptional()
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Phone number must be a valid international format'
  })
  readonly phoneNumber?: string;

  @IsOptional()
  @IsBoolean()
  readonly isActive?: boolean;

}
