import { Field, Int, ObjectType, OmitType } from '@nestjs/graphql';
import { CommentType } from './comment.type';

@ObjectType()
export class Comment extends OmitType(CommentType, ['tweet']) {}

@ObjectType()
export class GetCommentsType {
  @Field(() => Int)
  totalCount: number;

  @Field(() => [Comment])
  comments: Comment[];
}
