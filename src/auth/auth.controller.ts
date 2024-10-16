import { AuthService } from './auth.service';
import {
  Controller,
  Post,
  UseGuards,
  Get,
  Req,
  HttpCode,
  Body,
} from '@nestjs/common';

import { Request } from 'express';

import { AuthenticatedGuard, LocalAuthGuard, Public } from './local.guard';
import { UserService } from 'src/user/user.service';

import { RolesGuard } from './roles.guard';

import { LoginDto } from './dto/login.dto';

@Controller('auth')
@UseGuards(AuthenticatedGuard, RolesGuard)
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    return this.userService.transformUser(user);
  }

  @Get('logout')
  async logout(@Req() req) {
    req.session.destroy();
    req.logout(() => {});
    return { message: 'Успешно вышли' };
  }

  @Get('check')
  @Public()
  async getStatus(@Req() req: Request) {
    const isAuthenticated = req.isAuthenticated();
    const authInfo: {
      isAuthenticated: boolean;
      userInfo?: Record<string, any>;
    } = {
      isAuthenticated,
    };
    if (isAuthenticated) {
      const user = await this.userService.getUserById(req.user.id);
      authInfo.userInfo = this.getUserInfo(user);
    }

    return authInfo;
  }

  getUserInfo(user) {
    return {
      email: user.email,
      type: user.type,
      groups: user.groups,
      groupDetails: user.groupDetails,
    };
  }
}
