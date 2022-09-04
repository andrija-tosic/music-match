import { SessionSerializer } from './serializers/session.serializer';
import { LocalStrategy } from './strategies/local.strategy';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
    PassportModule.register({ session: true }),
    ConfigModule,
  ],

  providers: [
    {
      provide: AuthService.name,
      useClass: AuthService,
    },
    LocalStrategy,
    SessionSerializer,
  ],
  controllers: [AuthController],
  exports: [
    {
      provide: AuthService.name,
      useClass: AuthService,
    },
  ],
})
export class AuthModule {}
