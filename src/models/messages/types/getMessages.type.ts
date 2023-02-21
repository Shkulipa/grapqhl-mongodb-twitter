import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Message } from './message.type';

@ObjectType()
export class GetMessageType {
  @Field(() => Int)
  totalCount: number;

  @Field(() => [Message])
  messages: Message[];
}
