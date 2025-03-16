import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, CreateUserDto } from '../models/users.schema'; // Updated import
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async create(userDto: CreateUserDto): Promise<User> {
    const existingUser = await this.findByEmail(userDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(userDto.password, 10);
    const user = new this.userModel({ ...userDto, password: hashedPassword });
    return user.save();
  }
}