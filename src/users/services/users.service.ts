import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, CreateUserDto } from '../models/users.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async create(userDto: CreateUserDto): Promise<any> {
    const existingUser = await this.findByEmail(userDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(userDto.password, 10);
    const user = new this.userModel({ ...userDto, password: hashedPassword });
    const savedUser = await user.save();
    
    // Convert document to plain object and exclude the password using destructuring
    const { password, ...userWithoutPassword } = savedUser.toObject();
    return userWithoutPassword;
  }
}
