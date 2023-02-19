import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { TokensService } from './tokens.service';
import { Tokens } from '../jwt/types/jwt.type';
import { RefreshTokensInput } from './dto/refreshTokens.input';
import { UsePipes, ValidationPipe } from '@nestjs/common';

@Resolver()
export class TokensResolver {
  constructor(private readonly tokensService: TokensService) {}

  @UsePipes(new ValidationPipe())
  @Mutation(() => Tokens)
  async refreshTokens(
    @Args('refreshTokensInput') refreshTokensInput: RefreshTokensInput,
  ) {
    return await this.tokensService.refreshTokens(refreshTokensInput);
  }
}
