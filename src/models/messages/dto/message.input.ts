import { InputType, Field } from '@nestjs/graphql';
import { IsMongoId, IsNotEmpty, MaxLength } from 'class-validator';

@InputType()
export class MessageInput {
  @IsMongoId()
  @Field(() => String)
  chatId: string;

  @MaxLength(500)
  @IsNotEmpty()
  @Field(() => String)
  message: string;
}
