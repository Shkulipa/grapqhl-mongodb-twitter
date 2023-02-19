import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { ConfigService } from '@nestjs/config';
import { S3Service } from './s3.service';

@Module({
  providers: [S3Service, ConfigService],
  exports: [S3Service],
})
export class S3Module {}
