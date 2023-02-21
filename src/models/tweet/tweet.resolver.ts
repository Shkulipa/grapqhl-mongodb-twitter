import { Resolver, Mutation, Args, Query, Subscription } from '@nestjs/graphql';
import { TweetService } from './tweet.service';
import { CreateTweetInput } from './dto/createTweet.input';
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';
import { ICurrentUser } from 'src/common/interfaces/currentUser.interfaces';
import { GetTweetType } from './types/getTweets.type';
import { GetItembyIdInput } from 'src/common/dto/getItembyId.input';
import { CreateTweetType } from './types/createTweet.type';
import { GetTweetByIdType } from './types/getTweetById.type';
import { Roles } from 'src/common/decorators/roles.decorator';
import { EUserRoles } from 'src/common/interfaces/userRoles.interfaces';
import { DeleteTweetInput } from './dto/deleteTweet.input';
import { DeleteTweetType } from './types/deleteComment.type';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { IsExsistRole } from 'src/common/decorators/isExsistRole.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UpdateTweetInput } from './dto/updateTweet.input';
import { TweetType } from './types/tweet.type';
import { pubSub } from 'src/common/constants/pubSub';
import { QueryInput } from 'src/common/dto/query.type';

@Resolver()
export class TweetResolver {
  constructor(private readonly tweetService: TweetService) {}

  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  @Mutation((returns) => CreateTweetType)
  createTweet(
    @Args('createTweetInput') createTweetInput: CreateTweetInput,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    const newTweet = this.tweetService.create(createTweetInput, currentUser);
    pubSub.publish('createTweet', newTweet);
    return newTweet;
  }

  @Query((returns) => GetTweetType)
  getTweets(@Args('query') query: QueryInput) {
    return this.tweetService.getTweets(query);
  }

  @Query((returns) => GetTweetByIdType)
  getTweetById(@Args('query') id: GetItembyIdInput) {
    return this.tweetService.getTweetById(id);
  }

  @Roles(EUserRoles.DELETE_ANY_TWEET)
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe())
  @Mutation((returns) => DeleteTweetType)
  deleteTweet(
    @Args('deleteTweetInput') deletTweetInput: DeleteTweetInput,
    @IsExsistRole() isExsistRole: boolean,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.tweetService.deleteTweet(
      deletTweetInput,
      isExsistRole,
      currentUser,
    );
  }

  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  @Mutation((returns) => TweetType)
  async updateTweet(
    @Args('updateTweetInput') updateTweetInput: UpdateTweetInput,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    const tweet = await this.tweetService.updateTweet(
      updateTweetInput,
      currentUser,
    );
    pubSub.publish(`tweet_${tweet._id}`, tweet);
    return tweet;
  }

  @Subscription((returns) => TweetType, {
    resolve(payload, args, context, info) {
      return payload;
    },
  })
  addTweet() {
    return pubSub.asyncIterator(`createTweet`);
  }

  @Subscription((returns) => TweetType, {
    resolve(payload, args, context, info) {
      return payload;
    },
  })
  updatedTweet(@Args({ name: 'tweetId', type: () => String }) tweetId: string) {
    return pubSub.asyncIterator(`tweet_${tweetId}`);
  }
}
