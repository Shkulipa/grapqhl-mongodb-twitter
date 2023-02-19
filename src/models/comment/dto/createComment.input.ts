import { InputType, Field } from '@nestjs/graphql';
import { IsMongoId, MaxLength } from 'class-validator';

@InputType()
export class CreateCommentInput {
  @Field(() => String)
  @MaxLength(250)
  comment: string;

  @Field(() => String)
  @IsMongoId()
  tweetId: string;
}
