import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Chat } from './chat.type';

@ObjectType()
export class GetChatsType {
  @Field(() => Int)
  totalCount: number;

  @Field(() => [Chat])
  chats: Chat[];
}
