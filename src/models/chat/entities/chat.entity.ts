import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/models/user/entities/user.entity';

export type ChatDocument = HydratedDocument<Chat>;

@Schema({
  versionKey: false,
  timestamps: { createdAt: 'createdAt', updatedAt: false },
})
export class Chat {
  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  creator: Types.ObjectId;

  @Prop({ required: true, type: [Types.ObjectId], ref: User.name })
  members: Types.ObjectId[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
