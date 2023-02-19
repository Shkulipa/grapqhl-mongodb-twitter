import { InputType, Field } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';

@InputType()
export class DeleteTweetInput {
  @Field(() => String)
  @IsMongoId()
  tweetId: string;
}
