import { ObjectType, Field } from '@nestjs/graphql';
import { UserShortType } from 'src/common/types/userShort.type';

@ObjectType()
export class Chat {
  @Field(() => String)
  _id: string;

  @Field(() => UserShortType)
  creator: UserShortType;

  @Field(() => String)
  createdAt: string;

  @Field(() => [UserShortType])
  members: UserShortType;
}
