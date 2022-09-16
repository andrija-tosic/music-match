import { Artist, Genre, Release } from '@music-match/entities';
import { TrackModule } from './../track/track.module';
import { ArtistModule } from './../artist/artist.module';
import { Module } from '@nestjs/common';
import { ReleaseService } from './release.service';
import { ReleaseController } from './release.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Release, Artist, Genre])],
  controllers: [ReleaseController],
  providers: [ReleaseService],
})
export class ReleaseModule {}
