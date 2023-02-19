import { Module } from '@nestjs/common';
import { TweetService } from './tweet.service';
import { TweetResolver } from './tweet.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Tweet, TweetSchema } from './entity/tweet.entity';
import { JwtModule } from '../jwt/jwt.module';
import { UserModule } from '../user/user.module';
import { CommentSchema, Comment } from '../comment/entities/comment.entity';
import { S3Module } from '../s3/s3.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema },
      { name: Tweet.name, schema: TweetSchema },
    ]),
    JwtModule,
    S3Module,
    UserModule,
  ],
  providers: [TweetResolver, TweetService],
  exports: [TweetService],
})
export class TweetModule {}
