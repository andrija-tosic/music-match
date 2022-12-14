import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { PlaylistController } from './playlist.controller';
import { Playlist, PlaylistTrack, Track, User } from '@music-match/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Playlist, PlaylistTrack, Track, User])],
  controllers: [PlaylistController],
  providers: [PlaylistService],
})
export class PlaylistModule {}
