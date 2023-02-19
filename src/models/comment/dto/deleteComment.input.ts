import { InputType, Field } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';

@InputType()
export class DeleteCommentInput {
  @Field(() => String)
  @IsMongoId()
  commentId: string;
}
