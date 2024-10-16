import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { UserService } from './user.service';
import { CreateUserDTO } from './dto/user.create.dto';
import { RoleGuard } from 'src/auth/roles.guard';
import { UserGroupService } from 'src/user-group/user-group.service';
import { UpdateUserDTO } from './dto/user.update.dto';
import { IdDTO } from 'src/common/dto/id.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userGroupService: UserGroupService,
  ) {}

  //admin
  @Get('list')
  getUsersList() {}

  @Post()
  @RoleGuard('admin')
  async addUser(@Body() body: CreateUserDTO) {
    const existedGroup = await this.userGroupService.getUserGroupById(
      body.group,
    );
    if (!existedGroup) {
      throw new NotFoundException('Команды с таким ID не существует');
    }

    return this.userService.createUser(body);
  }

  @Patch('/:id')
  @RoleGuard('admin')
  async updateUser(@Body() body: UpdateUserDTO, @Param() { id }: IdDTO) {
    return this.userService.updateUser(id, body);
  }
}
