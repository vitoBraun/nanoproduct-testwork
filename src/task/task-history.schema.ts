import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { Task } from './task.schema';
import { User } from 'src/user/user.schema';

export type TaskHistoryDocument = TaskHistory & Document;

@Schema()
export class TaskHistory {
  @Prop({ type: Types.ObjectId, ref: 'Task', required: true })
  taskId: Task;

  @Prop({ enum: ['created', 'updated', 'deleted'], required: true })
  operation: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  modifiedBy: User;

  @Prop({ type: Date, default: Date.now })
  modifiedAt: Date;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  changes: Record<string, any>;
}

export const TaskHistorySchema = SchemaFactory.createForClass(TaskHistory);
