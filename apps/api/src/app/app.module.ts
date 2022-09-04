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
  Playlist,
  PlaylistTrack,
  Release,
  Track,
  User,
} from '@music-match/entities';
import { AzureStorageModule } from '@nestjs/azure-storage';

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
        entities: [Artist, Playlist, PlaylistTrack, Release, Track, User],
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
    AzureStorageModule.withConfigAsync({
      useFactory: async () => ({
        sasKey: process.env['AZURE_STORAGE_SAS_KEY'],
        accountName: process.env['AZURE_STORAGE_ACCOUNT'],
        containerName: 'music-match',
      }),
    }),

    UserModule,
    AuthModule,
  ],
  providers: [
    {
      provide: RolesGuard.name,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
