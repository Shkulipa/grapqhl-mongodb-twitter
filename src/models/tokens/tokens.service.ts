import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '../jwt/jwt.service';
import { User, UserDocument } from '../user/entities/user.entity';
import { RefreshTokensInput } from './dto/refreshTokens.input';

@Injectable()
export class TokensService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  private readonly logger = new Logger(TokensService.name);

  async refreshTokens(refreshTokensInput: RefreshTokensInput) {
    const { refreshToken } = refreshTokensInput;

    try {
      this.jwtService.verifyRefreshToken(refreshToken);

      const user = await this.userModel.findOne({ refreshToken });

      if (!user)
        throw new HttpException("Token wasn't found", HttpStatus.BAD_REQUEST);

      const tokens = this.jwtService.createTokens({ _id: user._id });
      user.refreshToken = tokens.refreshToken;
      await user.save();

      return tokens;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
