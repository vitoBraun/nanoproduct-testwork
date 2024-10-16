import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserGroupDTO } from './dto/user-group.create.dto';
import { UserGroupService } from './user-group.service';

@Controller('user-group')
export class UserGroupController {
  constructor(private readonly userGroupService: UserGroupService) {}
  @Post()
  createUserGroup(@Body() body: CreateUserGroupDTO) {
    return this.userGroupService.createUserGroup(body);
  }
}
