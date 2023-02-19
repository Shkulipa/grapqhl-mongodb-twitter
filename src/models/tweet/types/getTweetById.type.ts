import { ObjectType, Field, PickType } from '@nestjs/graphql';
import { CommentType } from 'src/models/comment/types/comment.type';
import { TweetType } from './tweet.type';

@ObjectType()
export class CommentForOneTweetType extends PickType(CommentType, [
  '_id',
  'owner',
  'createdAt',
]) {
  @Field(() => [CommentType])
  comments: CommentType[];
}

@ObjectType()
export class GetTweetByIdType extends PickType(TweetType, [
  '_id',
  'owner',
  'description',
  'media',
  'createdAt',
]) {
  @Field(() => [CommentForOneTweetType])
  comments: CommentForOneTweetType[];
}
