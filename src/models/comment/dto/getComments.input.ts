import { InputType, Field, PickType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';
import { QueryInput } from 'src/common/dto/query.type';

@InputType()
export class GetCommentsInput extends PickType(QueryInput, ['limit', 'page']) {
  @Field(() => String)
  @IsMongoId()
  tweetId: string;
}
