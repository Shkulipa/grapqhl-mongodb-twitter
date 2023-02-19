import { ObjectType, OmitType } from '@nestjs/graphql';
import { CommentType } from './comment.type';

@ObjectType()
export class CreateCommentType extends OmitType(CommentType, ['comment']) {}
