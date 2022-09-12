import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { Artist, Release, Track, User, Playlist } from '@music-match/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Artist, Release, Track, User, Playlist])],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
