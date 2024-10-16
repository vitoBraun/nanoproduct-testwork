import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CronJob } from 'cron';
import { Model } from 'mongoose';
import { TaskDocument } from 'src/task/task.schema';

@Injectable()
export class CronService implements OnModuleInit {
  constructor(
    @InjectModel('Task') private readonly taskModel: Model<TaskDocument>,
  ) {}
  async onModuleInit() {
    Logger.log('CRON Service started');
    this.startOverdueJob();
    this.findOverDueTasks();
  }

  async startOverdueJob() {
    const job = new CronJob('*/1 * * * *', this.findOverDueTasks.bind(this));
    job.start();
  }

  async findOverDueTasks() {
    const overduedTasks = await this.taskModel.find({
      dueDate: { $lte: new Date().toISOString() },
      status: { $nin: ['overdue', 'completed'] },
    });

    if (overduedTasks.length) {
      Logger.log(
        `Найдено ${overduedTasks.length} просроченных задач, меняем статус на overdue`,
      );
      overduedTasks.forEach((task) => {
        task.status = 'overdue';
        task.save();
      });
    }
  }
}
