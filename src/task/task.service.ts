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

  async getTasksByUserId(id) {
    return this.taskModel.find({ assignedToUser: id });
  }
}
