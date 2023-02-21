import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ICurrentUser } from 'src/common/interfaces/currentUser.interfaces';
import { ChatService } from '../chat/chat.service';
import { Chat, ChatDocument } from '../chat/entities/chat.entity';
import { User, UserDocument } from '../user/entities/user.entity';
import { DeleteMessageInput } from './dto/deleteMessage.input';
import { GetMessageInput } from './dto/getMessages.input';
import { MessageInput } from './dto/message.input';
import { UpdateMessageInput } from './dto/updateMessage.input';
import { Message, MessageDocument } from './entities/message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<ChatDocument>,
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
    private readonly chatService: ChatService,
  ) {}

  private readonly logger = new Logger(MessagesService.name);

  async createMessage(createMessageInput: MessageInput, sender: ICurrentUser) {
    const { chatId, message } = createMessageInput;

    try {
      const chat = await this.chatService.getChatById(chatId, sender);
      const newMsg = await this.messageModel.create({
        chat: chat._id,
        owner: sender._id,
        message,
      });

      return {
        _id: newMsg._id,
        chat,
        message,
        owner: sender,
      };
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async updateMessage(
    updateMessageInput: UpdateMessageInput,
    sender: ICurrentUser,
  ) {
    const { messageId, message: updatedMessage } = updateMessageInput;

    try {
      const message = await this.getMessageById(messageId);

      if (message.owner._id.toString() !== sender._id.toString())
        throw new HttpException('Yoy are not owner', HttpStatus.FORBIDDEN);

      message.message = updatedMessage;
      message.save();

      return message;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async deleteMessage(
    deleteMessageInput: DeleteMessageInput,
    currentUser: ICurrentUser,
  ) {
    const { messageId } = deleteMessageInput;

    try {
      const message = await this.getMessageById(messageId);

      if (message.owner._id.toString() !== currentUser._id.toString())
        throw new HttpException('Yoy are not owner', HttpStatus.FORBIDDEN);

      await this.messageModel.findByIdAndRemove(new Types.ObjectId(messageId));

      return message;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async getMessages(
    getMessagesInput: GetMessageInput,
    currentUser: ICurrentUser,
  ) {
    const { limit, page, chatId } = getMessagesInput;

    try {
      await this.chatService.getChatById(chatId, currentUser);
      const messages = await this.messageModel
        .find({ chat: new Types.ObjectId(chatId) })
        .sort([['createdAt', 1]])
        .skip(limit * page - limit)
        .limit(limit)
        .populate([
          {
            path: 'owner',
            select: ['_id', 'username', 'photo'],
          },
          {
            path: 'chat',
            populate: [
              {
                path: 'members',
                select: ['_id', 'username', 'photo'],
              },
              {
                path: 'creator',
                select: ['_id', 'username', 'photo'],
              },
            ],
          },
        ]);

      const totalCount = await this.chatModel.find({ chat: chatId }).count();

      const result = {
        totalCount,
        messages,
      };

      return result;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async getMessageById(messageId: string) {
    try {
      const message = await this.messageModel
        .findById(new Types.ObjectId(messageId))
        .populate([
          {
            path: 'owner',
            select: ['_id', 'username'],
          },
          {
            path: 'chat',
            populate: [
              {
                path: 'members',
                select: ['_id', 'username', 'photo'],
              },
              {
                path: 'creator',
                select: ['_id', 'username', 'photo'],
              },
            ],
          },
        ]);

      if (!message)
        throw new HttpException("Message wasn't found", HttpStatus.FORBIDDEN);

      return message;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
