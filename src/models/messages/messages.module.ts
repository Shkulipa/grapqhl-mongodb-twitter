import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesResolver } from './messages.resolver';
import { Message, MessageSchema } from './entities/message.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from '../chat/entities/chat.entity';
import { ChatModule } from '../chat/chat.module';
import { User, UserSchema } from '../user/entities/user.entity';
import { JwtModule } from '../jwt/jwt.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chat.name, schema: ChatSchema },
      { name: Message.name, schema: MessageSchema },
      { name: User.name, schema: UserSchema },
    ]),
    ChatModule,
    JwtModule,
    UserModule,
  ],
  providers: [MessagesResolver, MessagesService],
})
export class MessagesModule {}
