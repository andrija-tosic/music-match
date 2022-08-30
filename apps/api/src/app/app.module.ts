import { AuthModule } from './../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';

import { UsersModule } from './users/users.module';
import { typeormConfig } from '../../typeorm.config'

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(typeormConfig),

    UsersModule,
    AuthModule
  ],
})
export class AppModule { }
