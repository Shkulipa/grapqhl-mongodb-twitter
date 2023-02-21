import { InputType, Field } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';
import { QueryInput } from 'src/common/dto/query.type';

@InputType()
export class GetMessageInput extends QueryInput {
  @IsMongoId()
  @Field(() => String)
  chatId: string;
}
