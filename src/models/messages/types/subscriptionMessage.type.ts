import { ObjectType, Field } from '@nestjs/graphql';
import { Message } from './message.type';

@ObjectType()
export class SubscriptionMessageType {
  @Field(() => String)
  action: string;

  @Field(() => Message)
  message: Message;
}
