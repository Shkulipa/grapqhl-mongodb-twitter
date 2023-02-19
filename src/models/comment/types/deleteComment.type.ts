import { ObjectType, PickType } from '@nestjs/graphql';
import { CommentType } from './comment.type';

@ObjectType()
export class DeleteCommentType extends PickType(CommentType, ['_id']) {}
