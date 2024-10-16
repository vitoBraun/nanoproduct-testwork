import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TaskDocument } from './task.schema';
import { Model } from 'mongoose';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel('Task') private readonly taskModel: Model<TaskDocument>,
  ) {}

  async addTask(task) {
    return this.taskModel.create(task);
  }

  async getTasksByUserId({ assignedToUserId, query }) {
    const conditions = {
      assignedToUser: assignedToUserId,
      ...(query.dueDate && { dueDate: { $lte: query.dueDate } }),
      ...(query.status && { status: query.status }),
    };
    return this.taskModel.find(conditions);
  }

  async getTasksByGroupId({ assignedToGroupId, query }) {
    const conditions = {
      assignedToGroup: assignedToGroupId,
      ...(query.dueDate && { dueDate: { $lte: query.dueDate } }),
      ...(query.status && { status: query.status }),
    };
    return this.taskModel.find(conditions);
  }

  async updateTaskById({ id, task, assignedToUser }) {
    return this.taskModel.findOneAndUpdate(
      {
        _id: id,
        assignedToUser,
      },
      task,
      { new: true, useFindAndModify: false },
    );
  }
}
