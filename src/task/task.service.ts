import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TaskDocument } from './task.schema';
import { Model } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { UserGroupService } from 'src/user-group/user-group.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel('Task') private readonly taskModel: Model<TaskDocument>,
    private readonly userService: UserService,
    private readonly userGroupService: UserGroupService,
  ) {}

  async addTask(task) {
    return this.taskModel.create(task);
  }

  async getTasksByUserId({ assignedToUserId, query }) {
    const existingUser = await this.userService.getUserById(assignedToUserId);
    if (!existingUser) {
      throw new NotFoundException('Пользователь не найден');
    }
    const conditions = {
      assignedToUser: assignedToUserId,
      ...(query.dueDate && { dueDate: { $lte: query.dueDate } }),
      ...(query.status && { status: query.status }),
    };
    return this.taskModel.find(conditions);
  }

  async getTasksByGroupId({ assignedToGroupId, query }) {
    const existingGroup =
      await this.userGroupService.getUserGroupById(assignedToGroupId);
    if (!existingGroup) {
      throw new NotFoundException('Команда не найдена');
    }
    const conditions = {
      assignedToGroup: assignedToGroupId,
      ...(query.dueDate && { dueDate: { $lte: query.dueDate } }),
      ...(query.status && { status: query.status }),
    };
    return this.taskModel.find(conditions);
  }

  async getTasks({ query }) {
    const conditions = {
      ...(query.dueDate && { dueDate: { $lte: query.dueDate } }),
      ...(query.status && { status: query.status }),
    };
    return this.taskModel.find(conditions);
  }

  async updateTaskAssignedToUser({ id, task, assignedToUser }) {
    const existingUser = await this.userService.getUserById(assignedToUser);
    if (!existingUser) {
      throw new NotFoundException('Пользователь не найден');
    }
    return this.taskModel.findOneAndUpdate(
      {
        _id: id,
        assignedToUser,
      },
      task,
      { new: true, useFindAndModify: false },
    );
  }

  async updateTaskById({ id, task }) {
    const existingTask = await this.taskModel.findById(id);
    if (!existingTask) {
      throw new NotFoundException('Задача не найдена');
    }
    return this.taskModel.findOneAndUpdate(
      {
        _id: id,
      },
      task,
      { new: true, useFindAndModify: false },
    );
  }
}
