import {
  Controller,
  Delete,
  FileTypeValidator,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { Express } from 'express';
import 'multer';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: 'jpeg|jpg|png|gif|webp|bmp|tif|tiff',
          }),
        ],
      })
    )
    file: Express.Multer.File
  ): Promise<{ url: string }> {
    return await this.fileService.upload(file);
  }

  @Delete()
  async delete(@Query('url') url: string) {
    return await this.fileService.delete(url);
  }
}
