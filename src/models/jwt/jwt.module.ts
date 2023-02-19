import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { JwtService } from '../jwt/jwt.service';

@Module({
  providers: [JwtService, ConfigService],
  exports: [JwtService],
})
export class JwtModule {}
