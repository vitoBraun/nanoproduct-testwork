import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { DbModule } from 'src/db/db.module';
import { UserModule } from 'src/user/user.module';
import { UserGroupModule } from 'src/user-group/user-group.module';

@Module({
  imports: [DbModule, UserModule, UserGroupModule],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
