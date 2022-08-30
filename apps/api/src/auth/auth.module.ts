import { AuthorizeGuard } from './guards/authorize.guard';
import { LoginWithCredentialsGuard } from './guards/local-auth.guard';
import { SessionSerializer } from './serializers/session.serializer';
import { LocalStrategy } from './strategies/local.strategy';
import { User } from '@e-exam-workspace/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './../app/users/users.service';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../app/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), PassportModule.register({
    session: true
  }),],

  providers: [{
    provide: AuthService.name,
    useClass: AuthService
  },
  {
    provide: UsersService.name,
    useClass: UsersService
  },
    LocalStrategy,
    SessionSerializer,
    AuthorizeGuard,
    LoginWithCredentialsGuard,
  ],
  controllers: [AuthController],
  exports: [{
    provide: AuthService.name,
    useClass: AuthService
  }]

})
export class AuthModule { }
