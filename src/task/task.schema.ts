import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserGroup } from 'src/user-group/user-group.schema';
import { User } from 'src/user/user.schema';

export type TaskDocument = Task & Document;

export const statuses = ['created', 'in-progress', 'completed', 'overdue'];

@Schema()
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ enum: statuses, default: 'created' })
  status?: string;

  @Prop()
  dueDate?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  assignedToUser?: User;

  @Prop({ type: Types.ObjectId, ref: 'UserGroup', required: false })
  assignedToGroup?: UserGroup;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
