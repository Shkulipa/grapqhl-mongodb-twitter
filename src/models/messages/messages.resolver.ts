import { Resolver, Mutation, Args, Query, Subscription } from '@nestjs/graphql';
import { MessagesService } from './messages.service';
import { MessageInput } from './dto/message.input';
import { Message } from './types/message.type';
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';
import { ICurrentUser } from 'src/common/interfaces/currentUser.interfaces';
import { GetMessageInput } from './dto/getMessages.input';
import { GetMessageType } from './types/getMessages.type';
import { DeleteMessageInput } from './dto/deleteMessage.input';
import { UpdateMessageInput } from './dto/updateMessage.input';
import { pubSub } from 'src/common/constants/pubSub';
import { SubscriptionMessageType } from './types/subscriptionMessage.type';
import { AuthSubscriptionGuard } from 'src/common/guards/authSubscription.guard';
import { IsMemberChatGuard } from './guards/isMemberChat.guard';

enum EAction {
  ADD_MESSAGE = 'ADD_MESSAGE',
  DELETE_MESSAGE = 'DELETE_MESSAGE',
  UPDATE_MESSAGE = 'UPDATE_MESSAGE',
}

@Resolver()
export class MessagesResolver {
  constructor(private readonly messagesService: MessagesService) {}

  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  @Mutation(() => Message)
  async createMessage(
    @Args('createMessageInput') createMessageInput: MessageInput,
    @CurrentUser() sender: ICurrentUser,
  ) {
    const message = this.messagesService.createMessage(
      createMessageInput,
      sender,
    );
    pubSub.publish(`chat_${createMessageInput.chatId}`, {
      action: EAction.ADD_MESSAGE,
      message,
    });
    return message;
  }

  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  @Mutation(() => Message)
  async updateMessage(
    @Args('updateMessageInput') updateMessageInput: UpdateMessageInput,
    @CurrentUser() sender: ICurrentUser,
  ) {
    const message = await this.messagesService.updateMessage(
      updateMessageInput,
      sender,
    );
    pubSub.publish(`chat_${updateMessageInput.chatId}`, {
      action: EAction.UPDATE_MESSAGE,
      message,
    });
    return message;
  }

  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  @Mutation(() => Message)
  async deleteMessage(
    @Args('deleteMessagesInput') deleteMessageInput: DeleteMessageInput,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    const message = await this.messagesService.deleteMessage(
      deleteMessageInput,
      currentUser,
    );

    pubSub.publish(`chat_${deleteMessageInput.chatId}`, {
      action: EAction.DELETE_MESSAGE,
      message,
    });

    return message;
  }

  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  @Query(() => GetMessageType)
  getMessages(
    @Args('getMessagesInput') getMessagesInput: GetMessageInput,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.messagesService.getMessages(getMessagesInput, currentUser);
  }

  @UseGuards(AuthSubscriptionGuard, IsMemberChatGuard)
  @Subscription((returns) => SubscriptionMessageType, {
    resolve(payload, args, context, info) {
      return payload;
    },
  })
  subscriptionMessage(
    @Args({ name: 'chatId', type: () => String }) chatId: string,
  ) {
    return pubSub.asyncIterator(`chat_${chatId}`);
  }
}
