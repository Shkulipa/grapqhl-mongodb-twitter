import { ConfigModule } from '@nestjs/config/dist/config.module';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { MongooseModuleAsyncOptions } from '@nestjs/mongoose/dist/interfaces/mongoose-options.interface';

const mongooseConfig: MongooseModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    const MONGODB_URL = configService.get<string>('MONGODB_URL');
    return {
      uri: MONGODB_URL,
    };
  },
  inject: [ConfigService],
};

export default mongooseConfig;
