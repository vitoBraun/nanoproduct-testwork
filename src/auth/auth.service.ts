import { comparePassword } from 'src/common/helper';

import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(email: string, password: string): Promise<any> {
    const lowerEmail = email.toLowerCase();
    const findUserData = await this.userService.findUserByEmail(lowerEmail);
    if (!findUserData) {
      throw new ForbiddenException('Пользователь не найден');
    }
    const IsValidPassword = await comparePassword(
      password,
      findUserData.passwordHash,
    );
    if (!IsValidPassword) {
      throw new ForbiddenException('Неправильный пароль');
    }
    delete findUserData.passwordHash;
    return findUserData;
  }
}
