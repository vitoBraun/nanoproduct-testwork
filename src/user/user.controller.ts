import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Headers } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/user.create.dto';
import { RoleGuard } from 'src/auth/roles.guard';
import { UserGroupService } from 'src/user-group/user-group.service';
import { UpdateUserDTO } from './dto/user.update.dto';
import { IdDTO } from 'src/common/dto/id.dto';
import { Public } from 'src/auth/local.guard';
import { RegisterUserDTO } from './dto/user.register.dto';
import { ConfigService } from '@nestjs/config';

@Controller('user')
@RoleGuard('admin')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userGroupService: UserGroupService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  async addUser(@Body() body: CreateUserDTO) {
    if (body.group) {
      const existedGroup = await this.userGroupService.getUserGroupById(
        body.group,
      );
      if (!existedGroup) {
        throw new NotFoundException('Команды с таким ID не существует');
      }
    }

    return this.userService.createUser(body);
  }

  @Patch('/:id')
  async updateUser(@Body() body: UpdateUserDTO, @Param() { id }: IdDTO) {
    return this.userService.updateUser(id, body);
  }

  @Delete('/:id')
  async deleteUser(@Param() { id }: IdDTO) {
    return this.userService.deleteUser(id);
  }

  @Get('list')
  async getUsersList() {
    return this.userService.getUsersList();
  }

  @Get('/by_id/:id')
  async getUserById(@Param() { id }: IdDTO) {
    return this.userService.getUserById(id);
  }

  @Post('/register')
  @Public()
  async registerUser(@Body() body: RegisterUserDTO, @Headers() headers) {
    const { email, password } = body;
    if (
      this.configService.get('NODE_ENV') !== 'test' &&
      headers.host !== this.configService.get('HOST')
    ) {
      throw new ForbiddenException();
    } else if (!email || !password) {
      throw new BadRequestException('Некорректные данные');
    } else {
      try {
        const user = await this.userService.createUser({
          email,
          password,
          role: 'user',
        });
        Logger.log(`Пользователь ${email} зарегистрирован`);

        return user;
      } catch (err) {
        throw new BadRequestException(err.message);
      }
    }
  }
}
