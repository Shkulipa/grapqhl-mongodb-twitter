import { ObjectType, PickType } from '@nestjs/graphql';
import { TweetType } from './tweet.type';

@ObjectType()
export class DeleteTweetType extends PickType(TweetType, ['_id']) {}
