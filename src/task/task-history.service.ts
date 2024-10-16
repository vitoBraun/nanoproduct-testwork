import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TaskHistory, TaskHistoryDocument } from './task-history.schema';

@Injectable()
export class TaskHistoryService {
  constructor(
    @InjectModel(TaskHistory.name)
    private taskHistoryModel: Model<TaskHistoryDocument>,
  ) {}

  async logHistory(
    taskId: string,
    operation: string,
    modifiedBy: string,
    changes: Record<string, any>,
  ) {
    const taskHistory = new this.taskHistoryModel({
      taskId,
      operation,
      modifiedBy,
      changes,
    });
    return taskHistory.save();
  }
}
