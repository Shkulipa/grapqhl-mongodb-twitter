import { ObjectType, PickType } from '@nestjs/graphql';
import { TweetType } from './tweet.type';

@ObjectType()
export class CreateTweetType extends PickType(TweetType, [
  '_id',
  'owner',
  'description',
  'media',
  'createdAt',
]) {}
