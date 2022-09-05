import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { AzureStorageService, AzureStorageModule } from '@nestjs/azure-storage';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    AzureStorageModule.withConfigAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        sasKey: configService.getOrThrow('AZURE_STORAGE_SAS_KEY'),
        accountName: configService.getOrThrow('AZURE_STORAGE_ACCOUNT'),
        containerName: 'music-match'
      })
    })
  ],
  controllers: [FileController],
  providers: [FileService, AzureStorageService]
})
export class FileModule {}
