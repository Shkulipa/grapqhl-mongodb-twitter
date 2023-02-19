import { ApolloDriverConfig } from '@nestjs/apollo/dist/interfaces/apollo-driver-config.interface';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { GraphQLModule } from '@nestjs/graphql/dist/graphql.module';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
import { grapqhlConfig } from 'src/configs/app/grapqhl.config';
import { modeConfig } from 'src/configs/app/mode.config';
import mongooseConfig from 'src/configs/database/mongo/mongoose.config';
import { CommentModule } from '../comment/comment.module';
import { FilesModule } from '../files/files.module';
import { TokensModule } from '../tokens/tokens.module';
import { TweetModule } from '../tweet/tweet.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(modeConfig),
    MongooseModule.forRootAsync(mongooseConfig),
    GraphQLModule.forRoot<ApolloDriverConfig>(grapqhlConfig),
    FilesModule,
    UserModule,
    TweetModule,
    CommentModule,
    TokensModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
