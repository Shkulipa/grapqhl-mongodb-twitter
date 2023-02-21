import { ObjectType, Field } from '@nestjs/graphql';
import { UserShortType } from 'src/common/types/userShort.type';
import { Chat } from 'src/models/chat/types/chat.type';

@ObjectType()
export class Message {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  message: string;

  @Field(() => UserShortType)
  owner: UserShortType;

  @Field(() => Chat)
  chat: Chat;
}
