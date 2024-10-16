import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from 'src/user/user.service';

export const RoleGuard = Reflector.createDecorator<string>();

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roleGuard = this.reflector.get(RoleGuard, context.getHandler());

    if (!roleGuard) {
      return true;
    }
    const request = context.switchToHttp().getRequest();

    const user_id = request.session.passport.user;

    const user = await this.userService.getUserById(user_id);
    const role = user.role;

    if (role === 'admin') {
      return true;
    }

    return false;
  }
}
