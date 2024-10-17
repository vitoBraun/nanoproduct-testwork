import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { UserGroup } from 'src/user-group/user-group.schema';

export const roles = ['user', 'admin'];

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ unique: true, required: true })
  email: string;

  @Prop()
  passwordHash: string;

  @Prop({ required: true, enum: roles })
  role: string;

  @Prop({ type: Types.ObjectId, ref: 'UserGroup', required: false })
  group?: UserGroup;
}

export const UserSchema = SchemaFactory.createForClass(User);
