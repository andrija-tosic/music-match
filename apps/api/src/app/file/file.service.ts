import { ConfigService } from '@nestjs/config';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import { Multer } from 'multer';
import * as crypto from 'node:crypto';
import * as path from 'node:path';

@Injectable()
export class FileService {
  constructor(private readonly configService: ConfigService) {}
  azureConnectionString = this.configService.getOrThrow(
    'AZURE_STOREGE_ACCOUNT_CONNECTION_STRING'
  );
  containerName = 'music-match';

  getBlobClient(fileName: string): BlockBlobClient {
    const blobClientService = BlobServiceClient.fromConnectionString(
      this.azureConnectionString
    );
    const containerClient = blobClientService.getContainerClient(
      this.containerName
    );
    const blobClient = containerClient.getBlockBlobClient(fileName);
    return blobClient;
  }

  async upload(file: Express.Multer.File) {
    const newFileName = crypto.randomUUID() + path.extname(file.originalname);
    const blobClient = this.getBlobClient(newFileName);
    await blobClient.uploadData(file.buffer);

    Logger.log(blobClient.url, 'File uploaded to Azure blob storage');

    return { url: blobClient.url };
  }

  async delete(url: string) {
    const fileName = url.split('/').at(-1);
    const blobClient = this.getBlobClient(fileName);
    const { succeeded } = await blobClient.deleteIfExists();

    if (!succeeded) {
      throw new InternalServerErrorException();
    }

    return { succeeded };
  }
}
