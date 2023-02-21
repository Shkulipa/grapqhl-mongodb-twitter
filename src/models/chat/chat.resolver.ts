import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { ChatService } from './chat.service';
import { Chat } from './types/chat.type';
import { CreateChatInput } from './dto/createChat.input';
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ICurrentUser } from 'src/common/interfaces/currentUser.interfaces';
import { GetChatsType } from './types/getChats.type';
import { QueryInput } from 'src/common/dto/query.type';
import { ChatInput } from './dto/chat.input';
import { GetChatById } from './types/getChatById.type';

@Resolver(() => Chat)
export class ChatResolver {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  @Query(() => GetChatsType)
  getChats(
    @Args('query') queryInput: QueryInput,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.chatService.getChats(queryInput, user);
  }

  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  @Query(() => GetChatById)
  getChatById(
    @Args('chatInput') chatInput: ChatInput,
    @CurrentUser() user: ICurrentUser,
  ) {
    const { chatId } = chatInput;
    return this.chatService.getChatById(chatId, user);
  }

  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  @Mutation(() => Chat)
  createChat(
    @Args('createChatInput') createChatInput: CreateChatInput,
    @CurrentUser() creator: ICurrentUser,
  ) {
    return this.chatService.createChat(createChatInput, creator);
  }

  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  @Mutation(() => Chat)
  deleteChatInOneUser(
    @Args('chatInput') chatInput: ChatInput,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.chatService.deleteChatInOneUser(chatInput, currentUser);
  }
}
