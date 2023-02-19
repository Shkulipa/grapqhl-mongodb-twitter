import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentResolver } from './comment.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentSchema, Comment } from './entities/comment.entity';
import { Tweet, TweetSchema } from '../tweet/entity/tweet.entity';
import { JwtModule } from '../jwt/jwt.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    MongooseModule.forFeature([{ name: Tweet.name, schema: TweetSchema }]),
    JwtModule,
    UserModule,
  ],
  providers: [CommentResolver, CommentService],
})
export class CommentModule {}
