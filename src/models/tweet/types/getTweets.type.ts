import { ObjectType, Field, Int } from '@nestjs/graphql';
import { TweetType } from './tweet.type';

@ObjectType()
export class GetTweetType {
  @Field(() => Int)
  totalCount: number;

  @Field(() => [TweetType])
  tweets: TweetType[];
}
