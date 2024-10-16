import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

export type UserGroupDocument = UserGroup & Document;

@Schema()
export class UserGroup {
  @Prop({ unique: true, required: true })
  name: string;

  @Prop()
  description: string;
}

export const UserGroupSchema = SchemaFactory.createForClass(UserGroup);
