import { BadRequestException, Logger, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { connect, set } from 'mongoose';

export const MongoConnection: Provider = {
  provide: 'MONGO_CONNECTION',
  useFactory: async (configService: ConfigService) => {
    const MONGODB_URL = configService.get<string>('MONGODB_URL');

    const logger = new Logger('MongoConnection');

    try {
      set('strictQuery', false);
      await connect(MONGODB_URL, { serverSelectionTimeoutMS: 2500 });
      logger.log('✅ MongoDB success connected!');
    } catch (err) {
      throw new BadRequestException("❌ Clound't connect to DB", err);
    }
  },
  inject: [ConfigService],
};
