import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { QueryInput } from 'src/common/dto/query.type';
import { ICurrentUser } from 'src/common/interfaces/currentUser.interfaces';
import { User, UserDocument } from '../user/entities/user.entity';
import { ChatInput } from './dto/chat.input';
import { CreateChatInput } from './dto/createChat.input';
import { Chat, ChatDocument } from './entities/chat.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name)
    private readonly chatModel: Model<ChatDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  private readonly logger = new Logger(ChatService.name);

  async getChats(query: QueryInput, user: ICurrentUser) {
    const { limit, page } = query;
    const { _id } = user;

    try {
      const chats = await this.chatModel
        .find({
          members: { $in: [_id] },
        })
        .sort([['createdAt', 1]])
        .skip(limit * page - limit)
        .limit(limit)
        .populate([
          {
            path: 'creator',
            select: ['_id', 'username', 'photo'],
          },
          {
            path: 'members',
            select: ['_id', 'username', 'photo'],
          },
        ]);

      const totalCount = await this.chatModel
        .find({
          members: { $in: [_id] },
        })
        .count();

      return {
        totalCount,
        chats,
      };
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async createChat(createChatInput: CreateChatInput, creator: ICurrentUser) {
    const members = [creator._id, ...createChatInput.members];

    try {
      const chat = await this.chatModel.create({
        creator: creator._id,
        members,
      });

      const membersDetails = await this.userModel
        .find({
          _id: { $in: members },
        })
        .select(['_id', 'username', 'photo'])
        .lean();

      const creatorDetails = membersDetails.find(
        (u) => u._id.toString() === creator._id.toString(),
      );

      const result = {
        _id: chat._id,
        createdAt: (chat as any).createdAt,
        members: membersDetails,
        creator: creatorDetails,
      };

      return result;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async deleteChatInOneUser(chatInput: ChatInput, currentUser: ICurrentUser) {
    const { chatId } = chatInput;

    try {
      const chat = await this.getChatById(chatId, currentUser);

      const updateMembers = chat.members.filter(
        (u) => u._id.toString() !== currentUser._id.toString(),
      );

      if (updateMembers.length === 0) {
        await this.chatModel.findByIdAndRemove(new Types.ObjectId(chatId));
        return {
          ...chat,
          members: [],
        };
      }

      const updatedChat = await this.chatModel
        .findOneAndUpdate(
          new Types.ObjectId(chatId),
          {
            members: updateMembers,
          },
          { new: true },
        )
        .populate([
          {
            path: 'creator',
            select: ['_id', 'username', 'photo'],
          },
          {
            path: 'members',
            select: ['_id', 'username', 'photo'],
          },
        ])
        .lean();

      return updatedChat;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async getChatById(chatId: string, user: ICurrentUser) {
    try {
      const chat = await this.chatModel
        .findById(new Types.ObjectId(chatId))
        .populate([
          {
            path: 'creator',
            select: ['_id', 'username', 'photo'],
          },
          {
            path: 'members',
            select: ['_id', 'username', 'photo'],
          },
        ])
        .lean();

      if (!chat)
        throw new HttpException("Chat wasn't found", HttpStatus.NOT_FOUND);

      const isMemeberChat = chat.members.find(
        (m) => m._id.toString() === user._id.toString(),
      );

      if (!isMemeberChat)
        throw new HttpException(
          "You aren't a member of this chat",
          HttpStatus.FORBIDDEN,
        );

      return chat;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
