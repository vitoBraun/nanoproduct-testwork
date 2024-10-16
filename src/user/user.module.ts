import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DbModule } from 'src/db/db.module';
import { UserGroupModule } from 'src/user-group/user-group.module';

@Module({
  imports: [DbModule, UserGroupModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
