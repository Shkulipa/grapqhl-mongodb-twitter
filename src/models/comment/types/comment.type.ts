import { ObjectType, Field } from '@nestjs/graphql';
import { OwnerType } from 'src/common/types/owner.type';
import { TweetType } from 'src/models/tweet/types/tweet.type';

@ObjectType()
export class CommentType {
  @Field(() => String)
  _id: string;

  @Field(() => TweetType)
  tweet: TweetType;

  @Field(() => OwnerType)
  owner: OwnerType;

  @Field(() => String)
  comment: string;

  @Field(() => String)
  createdAt: string;
}
