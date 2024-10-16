import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserGroupSchema } from 'src/user-group/user-group.schema';

import { UserSchema } from 'src/user/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'UserGroup', schema: UserGroupSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class DbModule {}
