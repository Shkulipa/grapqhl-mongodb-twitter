import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/models/user/entities/user.entity';

export type CommentDocument = HydratedDocument<Comment>;

@Schema({
  versionKey: false,
  timestamps: { createdAt: 'createdAt', updatedAt: false },
})
export class Comment {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Tweet' })
  tweet: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  owner: Types.ObjectId;

  @Prop({ required: true, type: String })
  comment: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
