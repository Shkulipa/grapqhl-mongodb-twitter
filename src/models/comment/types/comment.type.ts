import { ObjectType, Field } from '@nestjs/graphql';
import { UserShortType } from 'src/common/types/userShort.type';
import { TweetType } from 'src/models/tweet/types/tweet.type';

@ObjectType()
export class CommentType {
  @Field(() => String)
  _id: string;

  @Field(() => TweetType)
  tweet: TweetType;

  @Field(() => UserShortType)
  owner: UserShortType;

  @Field(() => String)
  comment: string;

  @Field(() => String)
  createdAt: string;
}
