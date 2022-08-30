import { User } from '@e-exam-workspace/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [{
    provide: UsersService.name,
    useClass: UsersService
  }],
  exports: [
    {
      provide: UsersService.name,
      useClass: UsersService
    }
  ]
})
export class UsersModule { }
