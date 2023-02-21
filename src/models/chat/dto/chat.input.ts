import { InputType, Field } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';

@InputType()
export class ChatInput {
  @IsMongoId()
  @Field(() => String)
  chatId: string;
}
