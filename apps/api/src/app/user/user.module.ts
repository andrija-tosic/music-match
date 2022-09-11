import { User, Playlist } from '@music-match/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Playlist])],
  providers: [
    {
      provide: UserService.name,
      useClass: UserService,
    },
  ],
  exports: [
    {
      provide: UserService.name,
      useClass: UserService,
    },
  ],
  controllers: [UserController],
})
export class UserModule {}
