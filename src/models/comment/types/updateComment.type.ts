import { ObjectType, PickType } from '@nestjs/graphql';
import { CommentType } from './comment.type';

@ObjectType()
export class UpdateCommentType extends PickType(CommentType, [
  '_id',
  'comment',
  'createdAt',
]) {}
