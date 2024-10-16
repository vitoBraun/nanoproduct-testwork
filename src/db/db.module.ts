import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskSchema } from 'src/task/task.schema';
import { UserGroupSchema } from 'src/user-group/user-group.schema';

import { UserSchema } from 'src/user/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'UserGroup', schema: UserGroupSchema },
      { name: 'Task', schema: TaskSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class DbModule {}
