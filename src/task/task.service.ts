import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TaskDocument } from './task.schema';
import { Model } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { UserGroupService } from 'src/user-group/user-group.service';
import { TaskHistoryService } from './task-history.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel('Task') private readonly taskModel: Model<TaskDocument>,
    private readonly userService: UserService,
    private readonly userGroupService: UserGroupService,
    private taskHistoryService: TaskHistoryService,
  ) {}

  async addTask(task) {
    const newTask = await this.taskModel.create(task);
    this.taskHistoryService.logHistory(
      newTask.id,
      'created',
      task.assignedToUser,
      task,
    );
    return newTask;
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

    const updatedTask = await this.taskModel.findOneAndUpdate(
      {
        _id: id,
        assignedToUser,
      },
      task,
      { new: true, useFindAndModify: false },
    );

    this.taskHistoryService.logHistory(
      updatedTask.id,
      'updated',
      task.assignedToUser,
      task,
    );

    return updatedTask;
  }

  async updateTaskById({ id, task, responsibleUser }) {
    const existingTask = await this.taskModel.findById(id);
    if (!existingTask) {
      throw new NotFoundException('Задача не найдена');
    }

    const updatedTask = await this.taskModel.findOneAndUpdate(
      {
        _id: id,
      },
      task,
      { new: true, useFindAndModify: false },
    );

    if (updatedTask) {
      this.taskHistoryService.logHistory(
        updatedTask.id,
        'updated',
        responsibleUser.id,
        task,
      );
    }

    return updatedTask;
  }
}
