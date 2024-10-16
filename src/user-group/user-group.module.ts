import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { UserGroupService } from './user-group.service';
import { UserGroupController } from './user-group.controller';

@Module({
  imports: [DbModule],
  providers: [UserGroupService],
  controllers: [UserGroupController],
  exports: [UserGroupService],
})
export class UserGroupModule {}
