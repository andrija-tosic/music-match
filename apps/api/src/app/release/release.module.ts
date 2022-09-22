import { Artist, Genre, Release, Track } from '@music-match/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReleaseController } from './release.controller';
import { ReleaseService } from './release.service';

@Module({
  imports: [TypeOrmModule.forFeature([Release, Track, Artist, Genre])],
  controllers: [ReleaseController],
  providers: [ReleaseService],
})
export class ReleaseModule {}
