import { InputType, Field } from '@nestjs/graphql';
import { IsJWT } from 'class-validator';

@InputType()
export class RefreshTokensInput {
  @Field(() => String)
  @IsJWT()
  refreshToken: string;
}
