import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { UserService } from 'src/user/user.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  public constructor(private readonly userService: UserService) {
    super();
  }
  serializeUser(user: any, done: CallableFunction): any {
    return done(null, user.id);
  }

  async deserializeUser(payload: any, done: CallableFunction) {
    const user = await this.userService.getUserById(payload);
    done(null, user);
  }
}
