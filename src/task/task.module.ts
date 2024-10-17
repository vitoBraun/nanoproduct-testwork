import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { DbModule } from 'src/db/db.module';
import { UserModule } from 'src/user/user.module';
import { UserGroupModule } from 'src/user-group/user-group.module';
import { TaskHistoryService } from './task-history.service';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  imports: [DbModule, UserModule, UserGroupModule, SocketModule],
  controllers: [TaskController],
  providers: [TaskService, TaskHistoryService],
  exports: [TaskService],
})
export class TaskModule {}
