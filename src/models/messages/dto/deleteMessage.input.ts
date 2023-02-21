import { InputType, Field, PickType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';
import { MessageInput } from './message.input';

@InputType()
export class DeleteMessageInput extends PickType(MessageInput, ['chatId']) {
  @IsMongoId()
  @Field(() => String)
  messageId: string;
}
