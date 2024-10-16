import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserGroupDocument } from './user-group.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserGroupService {
  constructor(
    @InjectModel('UserGroup')
    private readonly userGroupModel: Model<UserGroupDocument>,
  ) {}
  async createUserGroup({
    name,
    description,
  }: {
    name: string;
    description: string;
  }) {
    const existingUserGroup = await this.userGroupModel.findOne({ name });
    if (existingUserGroup) {
      throw new ConflictException('Группа уже существует');
    }

    const userGroup = new this.userGroupModel({
      name,
      description,
    });
    await userGroup.save();
    return userGroup;
  }

  async getUserGroupById(id: string) {
    return this.userGroupModel.findById(id);
  }

  async getUserGroups() {
    return this.userGroupModel.find();
  }

  async deleteUserGroup(id: string) {
    const existingGroup = await this.userGroupModel.findById(id);
    if (!existingGroup) {
      throw new NotFoundException('Команда не найдена');
    }
    return this.userGroupModel.findByIdAndDelete(id);
  }
}
