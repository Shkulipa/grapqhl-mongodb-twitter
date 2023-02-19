import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { CommentSchema } from 'src/models/comment/entities/comment.entity';
import { IMedia } from 'src/models/files/interfaces/media.interfaces';
import { User } from 'src/models/user/entities/user.entity';

export type TweetDocument = HydratedDocument<Tweet>;

const media = {
  urlFile: { required: true, type: String },
  key: { required: true, type: String },
};

@Schema({
  versionKey: false,
  timestamps: { createdAt: 'createdAt', updatedAt: false },
})
export class Tweet {
  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  owner: Types.ObjectId;

  @Prop({ required: true, type: String })
  description: string;

  @Prop({
    required: true,
    type: [media],
    default: [],
  })
  media: IMedia[];
}

export const TweetSchema = SchemaFactory.createForClass(Tweet);