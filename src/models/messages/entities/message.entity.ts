import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Chat } from 'src/models/chat/entities/chat.entity';
import { User } from 'src/models/user/entities/user.entity';

export type MessageDocument = HydratedDocument<Message>;

@Schema({
  versionKey: false,
  timestamps: true,
})
export class Message {
  @Prop({ required: true, type: Types.ObjectId, ref: Chat.name })
  chat: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  owner: Types.ObjectId;

  @Prop({ required: true, type: String })
  message: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
