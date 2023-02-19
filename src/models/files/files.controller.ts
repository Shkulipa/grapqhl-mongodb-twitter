import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { fileSizeGuard } from 'src/common/guards/fileSize.guard';
import { fileTypeGuard } from 'src/common/guards/fileType.guard';
import { fileTypes, maxSizeMB } from 'src/common/constants/file.constants';

@Controller('/files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('/upload/tweet')
  @UseInterceptors(FilesInterceptor('files'))
  uploadTweetImages(@UploadedFiles() files: Express.Multer.File[]) {
    if (files.length === 0)
      throw new HttpException("Files wasn't provided", HttpStatus.BAD_REQUEST);
    fileSizeGuard(files, maxSizeMB);
    fileTypeGuard(files, fileTypes);

    const path = 'public/tweets';
    return this.filesService.uploadTweetImages(files, path);
  }
}
