import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserDocument } from './user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
  ) {}

  async createUser({
    email,
    password,
    role,
    group,
  }: {
    email: string;
    password: string;
    role: string;
    group: string;
  }) {
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('Пользователь уже существует');
    }

    const user = new this.userModel({
      email,
      passwordHash: await this.getPasswordHash(password),
      role,
      group,
    });
    await user.save();
    return this.transformUser(user);
  }

  async getUserById(id) {
    return this.userModel.findById(id);
  }

  async findUserByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async updateUser(
    id: string,
    {
      email,
      password,
      role,
      group,
    }: {
      email: string;
      password: string;
      role: string;
      group: string;
    },
  ) {
    return this.userModel.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          ...(email && { email }),
          ...(password && { password: await this.getPasswordHash(password) }),
          ...(role && { role }),
          ...(group && { group }),
        },
      },
      { new: true, useFindAndModify: false },
    );
  }

  async deleteUser(id: string) {
    const existingUser = await this.userModel.findById(id);
    if (!existingUser) {
      throw new NotFoundException('Пользователь с таким ID не найден');
    }
    return this.userModel.findByIdAndDelete(id);
  }

  async getUsersList() {
    return (await this.userModel.find()).map((user) =>
      this.transformUser(user),
    );
  }

  async getPasswordHash(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  transformUser(user) {
    return {
      id: user._id.toString(),
      email: user.email,
      type: user.type,
      group: user.group,
    };
  }
}
