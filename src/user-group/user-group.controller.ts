import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateUserGroupDTO } from './dto/user-group.create.dto';
import { UserGroupService } from './user-group.service';
import { RoleGuard } from 'src/auth/roles.guard';
import { IdDTO } from 'src/common/dto/id.dto';

@Controller('user-group')
@RoleGuard('admin')
export class UserGroupController {
  constructor(private readonly userGroupService: UserGroupService) {}
  @Post()
  createUserGroup(@Body() body: CreateUserGroupDTO) {
    return this.userGroupService.createUserGroup(body);
  }

  @Get('list')
  getUserGroupList() {
    return this.userGroupService.getUserGroups();
  }

  @Delete('/:id')
  deleteUserGroup(@Param() { id }: IdDTO) {
    return this.userGroupService.deleteUserGroup(id);
  }
}
