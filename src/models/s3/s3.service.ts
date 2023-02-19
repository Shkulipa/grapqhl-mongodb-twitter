import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

// can be raplaced by 'nanoid', because take a less size
import { v4 as uuidv4 } from 'uuid';
import { extension } from 'mime-types';

@Injectable()
export class S3Service {
  constructor(private readonly configService: ConfigService) {}

  private readonly logger = new Logger(S3Service.name);

  AWS_BUCKET_NAME = this.configService.get<string>('AWS_BUCKET_NAME');
  AWS_BUCKET_REGION = this.configService.get<string>('AWS_BUCKET_REGION');

  s3Client = this.getClient();
  private getClient() {
    const region = this.configService.get<string>('AWS_BUCKET_REGION');
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY');
    const secretAccessKey = this.configService.get<string>(
      'AWS_SECRET_ACCESS_KEY',
    );

    const s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    return s3Client;
  }

  async create(file: Express.Multer.File, path: string) {
    try {
      const { mimetype, buffer } = file;

      const id = uuidv4();
      const extensionFile = extension(mimetype);
      const filename = id + '-' + Date.now() + '.' + extensionFile;
      const Key = path + '/' + filename;

      const uploadParams = {
        Bucket: this.AWS_BUCKET_NAME,
        Body: buffer,
        Key,
        ContentType: mimetype,
      };

      await this.s3Client.send(new PutObjectCommand(uploadParams));
      const urlFile = `https://${this.AWS_BUCKET_NAME}.s3.${this.AWS_BUCKET_REGION}.amazonaws.com/${Key}`;

      return {
        urlFile,
        key: Key, // need for delete obj
      };
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async delete(key: string) {
    try {
      const deleteParams = {
        Bucket: this.AWS_BUCKET_NAME,
        Key: key,
      };

      return this.s3Client.send(new DeleteObjectCommand(deleteParams));
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
