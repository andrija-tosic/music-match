import { Controller, Get, Post, Param, Delete, UseInterceptors, UploadedFile, Logger } from '@nestjs/common';
import { FileService } from './file.service';
import { AzureStorageFileInterceptor, UploadedFileMetadata } from '@nestjs/azure-storage';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @UseInterceptors(AzureStorageFileInterceptor('file'))
  uploadedFilesUsingInterceptor(@UploadedFile() file: UploadedFileMetadata) {
    Logger.log(`Storage URL: ${file.storageUrl}`, 'FileController');
    return file.storageUrl;
  }
}
