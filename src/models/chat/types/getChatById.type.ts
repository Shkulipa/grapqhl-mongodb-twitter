import { ObjectType } from '@nestjs/graphql';
import { Chat } from './chat.type';

@ObjectType()
export class GetChatById extends Chat {}
