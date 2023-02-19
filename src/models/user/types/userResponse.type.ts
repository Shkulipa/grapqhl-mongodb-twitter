import { ObjectType, Field } from '@nestjs/graphql';
import { Tokens } from 'src/models/jwt/types/jwt.type';
import { UserType } from './user.type';

@ObjectType()
export class UserTypeResponse {
  @Field(() => UserType)
  user: UserType;

  @Field(() => Tokens)
  tokens: Tokens;
}
