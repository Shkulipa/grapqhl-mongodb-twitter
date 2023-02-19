import { ObjectType, Field, Int } from '@nestjs/graphql';
import { UserType } from './user.type';

@ObjectType()
export class UserQueryType {
  @Field(() => Int)
  totalCount: number;

  @Field(() => [UserType])
  users: UserType[];
}
