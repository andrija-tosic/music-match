import { ReleaseModule } from './release/release.module';
import { RolesGuard } from './auth/guards/roles.guard';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import * as redisStore from 'cache-manager-redis-store';
import { config } from '../config';
import {
  Artist,
  Genre,
  Playlist,
  PlaylistTrack,
  Release,
  Track,
  User,
} from '@music-match/entities';
import { ArtistModule } from './artist/artist.module';
import { FileModule } from './file/file.module';
import { TrackModule } from './track/track.module';
import { PlaylistModule } from './playlist/playlist.module';
import { SearchModule } from './search/search.module';
import { RecommendationsModule } from './recommendations/recommendations.module';
import { environment } from '../environments/environment';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: environment.dbHost,
        port: 5000,
        username: 'postgres',
        password: configService.getOrThrow('POSTGRES_PASSWORD'),
        database: 'music-match-db',
        entities: [
          Artist,
          Playlist,
          PlaylistTrack,
          Release,
          Track,
          Genre,
          User,
        ],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    CacheModule.registerAsync({
      useFactory: () => ({
        store: redisStore,
        url: `redis://${environment.redisHost}:${environment.redisPort}`,
        // host: `${environment.redisHost}`,
        // port: environment.redisPort,
        isGlobal: true,
      }),
    }),

    UserModule,
    AuthModule,
    ArtistModule,
    ReleaseModule,
    TrackModule,
    FileModule,
    PlaylistModule,
    SearchModule,
    RecommendationsModule,
  ],
  providers: [
    {
      provide: RolesGuard.name,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
