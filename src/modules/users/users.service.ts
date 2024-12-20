import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ResourceNotFoundException } from '@/common/exceptions/resource-not-found.exception';
import { InvalidInputException } from '@/common/exceptions/invalid-input.exception';
import { UnexpectedErrorException } from '@/common/exceptions/unexpected-error.exception';
import { User, UserDocument } from '@/modules/users/schemas/user.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  private readonly SALT_ROUNDS = 10;

  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>
  ) {}

  /**
   * find all users
   */
  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  /**
   * Creates a new user account
   * @param createUserDto User creation data
   * @returns Newly created user object
   * @throws InvalidInputException if email already exists
   */
  async createUser(createUserDto: Partial<User>): Promise<User> {
    try {
      const existingUser = await this.findUserByEmail(createUserDto.email);
      if (existingUser) {
        throw new InvalidInputException('Email already exists');
      }

      const hashedPassword = await bcrypt.hash(createUserDto.password, this.SALT_ROUNDS);
      const newUser = new this.userModel({
        ...createUserDto,
        password: hashedPassword,
      });

      return await newUser.save();
    } catch (error) {
      if (error instanceof InvalidInputException) {
        throw error;
      }
      throw new UnexpectedErrorException('Error creating user');
    }
  }

  /**
   * Finds a user by their email address
   * @param email User's email address
   * @returns User object if found
   */
  async findUserByEmail(email: string): Promise<User | null> {
    try {
      return await this.userModel.findOne({ email }).exec();
    } catch (error) {
      throw new UnexpectedErrorException('Error finding user');
    }
  }

  /**
   * Retrieves a user by their ID
   * @param id User's unique identifier
   * @returns User object
   * @throws ResourceNotFoundException if user not found
   */
  async findUserById(id: string): Promise<User> {
    try {
      const user = await this.userModel.findById(id).exec();
      if (!user) {
        throw new ResourceNotFoundException('User not found');
      }
      return user;
    } catch (error) {
      if (error instanceof ResourceNotFoundException) {
        throw error;
      }
      throw new UnexpectedErrorException('Error finding user');
    }
  }

  /**
   * Updates user information
   * @param id User's unique identifier
   * @param updateUserDto Data to update
   * @returns Updated user object
   * @throws ResourceNotFoundException if user not found
   */
  async updateUser(id: string, updateUserDto: Partial<User>): Promise<User> {
    try {
      const user = await this.userModel
        .findByIdAndUpdate(id, updateUserDto, { new: true })
        .exec();
      
      if (!user) {
        throw new ResourceNotFoundException('User not found');
      }
      
      return user;
    } catch (error) {
      if (error instanceof ResourceNotFoundException) {
        throw error;
      }
      throw new UnexpectedErrorException('Error updating user');
    }
  }

  /**
   * Deletes a user account
   * @param id User's unique identifier
   * @throws ResourceNotFoundException if user not found
   */
  async deleteUser(id: string): Promise<void> {
    try {
      const result = await this.userModel.findByIdAndDelete(id).exec();
      if (!result) {
        throw new ResourceNotFoundException('User not found');
      }
    } catch (error) {
      if (error instanceof ResourceNotFoundException) {
        throw error;
      }
      throw new UnexpectedErrorException('Error deleting user');
    }
  }

  /**
   * Validates user credentials
   * @param email User's email
   * @param password User's password
   * @returns User object if credentials are valid
   * @throws InvalidInputException if credentials are invalid
   */
  async validateUserCredentials(email: string, password: string): Promise<User> {
    try {
      const user = await this.findUserByEmail(email);
      if (!user) {
        throw new InvalidInputException('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new InvalidInputException('Invalid credentials');
      }

      return user;
    } catch (error) {
      if (error instanceof InvalidInputException) {
        throw error;
      }
      throw new UnexpectedErrorException('Error validating credentials');
    }
  }
}
