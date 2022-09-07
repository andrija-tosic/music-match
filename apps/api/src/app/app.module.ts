import { ReleaseModule } from './release/release.module';
import { RolesGuard } from './auth/guards/roles.guard';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import * as redisStore from 'cache-manager-redis-store';
import { config } from '../config';
import { Artist, Playlist, PlaylistTrack, Release, Track, Genre, User } from '@music-match/entities';
import { ArtistModule } from './artist/artist.module';
import { FileModule } from './file/file.module';
import { TrackModule } from './track/track.module';
import { PlaylistModule } from './playlist/playlist.module';

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
        host: 'localhost',
        port: 5000,
        username: 'postgres',
        password: configService.getOrThrow('POSTGRES_PASSWORD'),
        database: 'music-match-db',
        entities: [Artist, Playlist, PlaylistTrack, Release, Track, Genre, User],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379,
      isGlobal: true,
    }),

    UserModule,
    AuthModule,
    ArtistModule,
    ReleaseModule,
    TrackModule,
    FileModule,
    PlaylistModule,
  ],
  providers: [
    {
      provide: RolesGuard.name,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
