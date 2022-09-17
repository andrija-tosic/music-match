import { Module } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { RecommendationsController } from './recommendations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist, Playlist, Release, Track, User } from '@music-match/entities';

@Module({
  imports: [TypeOrmModule.forFeature([User, Artist, Release, Track, Playlist])],
  controllers: [RecommendationsController],
  providers: [RecommendationsService],
})
export class RecommendationsModule {}
