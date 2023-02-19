import { Injectable, Logger } from '@nestjs/common';
import { S3Service } from '../s3/s3.service';

@Injectable()
export class FilesService {
  constructor(private readonly s3Service: S3Service) {}

  private readonly logger = new Logger(FilesService.name);

  async uploadTweetImages(files: Express.Multer.File[], path: string) {
    try {
      const images = [];

      // load file in s3
      for (const file of files) {
        const fileData = await this.s3Service.create(file, path);
        images.push(fileData);
      }

      return images;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async deleteImages(keys: string[]) {
    try {
      // delete files from s3
      for (const key of keys) {
        await this.s3Service.delete(key);
      }
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
