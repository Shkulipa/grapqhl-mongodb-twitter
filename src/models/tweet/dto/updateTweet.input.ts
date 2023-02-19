import { InputType, Field, PickType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';
import { CreateTweetInput } from './createTweet.input';

@InputType()
export class UpdateTweetInput extends PickType(CreateTweetInput, [
  'description',
]) {
  @Field(() => String)
  @IsMongoId()
  tweetId: string;
}
