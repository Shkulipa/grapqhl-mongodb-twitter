import { InputType, Field, PickType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';
import { MessageInput } from './message.input';

@InputType()
export class UpdateMessageInput extends PickType(MessageInput, [
  'message',
  'chatId',
]) {
  @IsMongoId()
  @Field(() => String)
  messageId: string;
}
