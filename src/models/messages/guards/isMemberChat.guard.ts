import { Injectable, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ChatService } from 'src/models/chat/chat.service';

@Injectable()
export class IsMemberChatGuard {
  constructor(private readonly chatService: ChatService) {}

  async canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const { user } = ctx.getContext();
    const chatId = context.getArgs()[1].chatId;

    try {
      await this.chatService.getChatById(chatId, user);
      return true;
    } catch (err) {
      throw err;
    }
  }
}
