// In src/users/services/users.service.ts
import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto, User } from '../models/users.schema'; // DTO is inside the schema

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async registerUser(createUserDto: CreateUserDto): Promise<any> {
    // Check if user exists by email
    const existingUser = await this.userModel.findOne({ email: createUserDto.email });
    if (existingUser) {
      throw new ConflictException('User with that email already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = new this.userModel({ ...createUserDto, password: hashedPassword });
    const user = await createdUser.save();
    // Convert Mongoose document to plain object and remove the password
    const userObj = user.toObject() as { password?: string };
    delete userObj.password;
    return userObj;
  }
}
