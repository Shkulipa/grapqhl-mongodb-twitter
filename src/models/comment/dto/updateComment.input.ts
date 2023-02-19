import { InputType, Field, PickType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';
import { CreateCommentInput } from './createComment.input';

@InputType()
export class UpdateCommentInput extends PickType(CreateCommentInput, [
  'comment',
]) {
  @Field(() => String)
  @IsMongoId()
  commentId: string;
}
