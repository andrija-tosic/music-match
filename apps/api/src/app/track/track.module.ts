import { Release, Track } from '@music-match/entities';
import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Track, Release])],
  controllers: [TrackController],
  providers: [TrackService],
})
export class TrackModule {}
