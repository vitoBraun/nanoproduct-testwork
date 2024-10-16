import { BasicStrategy } from './strategies/basic.strategy';
import { Module } from '@nestjs/common';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';

import { SessionSerializer } from './session.serializer.guard';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';

import { DbModule } from 'src/db/db.module';

@Module({
  exports: [LocalStrategy],
  imports: [DbModule, PassportModule.register({ session: true }), UserModule],
  providers: [SessionSerializer, BasicStrategy, LocalStrategy, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
