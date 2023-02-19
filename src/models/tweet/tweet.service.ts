import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import Redis from 'ioredis';
import { Model, Types } from 'mongoose';
import { GetItembyIdInput } from 'src/common/dto/getItembyId.input';
import { ICurrentUser } from 'src/common/interfaces/currentUser.interfaces';
import { QueryInput } from 'src/common/types/query.type';
import { Comment, CommentDocument } from '../comment/entities/comment.entity';
import { IORedisKey } from '../redis/redis.module';
import { S3Service } from '../s3/s3.service';
import { CreateTweetInput } from './dto/createTweet.input';
import { DeleteTweetInput } from './dto/deleteTweet.input';
import { UpdateTweetInput } from './dto/updateTweet.input';
import { Tweet, TweetDocument } from './entity/tweet.entity';

@Injectable()
export class TweetService {
  constructor(
    @Inject(IORedisKey) private readonly redisClient: Redis,
    @InjectModel(Tweet.name) private readonly tweetModel: Model<TweetDocument>,
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
    private readonly s3Service: S3Service,
  ) {}

  private readonly logger = new Logger(TweetService.name);

  async create(createTweetInput: CreateTweetInput, currentUser: ICurrentUser) {
    try {
      const newTweetData = {
        owner: currentUser._id,
        ...createTweetInput,
      };
      const newTweet = await this.tweetModel.create(newTweetData);

      const populateUser = newTweet.populate([
        {
          path: 'owner',
          select: ['_id', 'username', 'photo'],
        },
      ]);

      return populateUser;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async getTweets(query: QueryInput) {
    const { limit, page } = query;

    const key = `tweets(limit:${limit}, page:${page})`;
    const cachedTweets = await this.redisClient.get(key);
    if (cachedTweets) return JSON.parse(cachedTweets);

    try {
      const tweets = await this.tweetModel
        .find()
        .sort([['createdAt', 1]])
        .skip(limit * page - limit)
        .limit(limit)
        .populate([
          {
            path: 'owner',
            select: ['_id', 'username', 'photo'],
          },
        ]);

      const totalCount = await this.tweetModel.find().count();

      const result = {
        totalCount,
        tweets,
      };

      await this.redisClient.set(key, JSON.stringify(result), 'EX', 60);

      return result;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async getTweetById(query: GetItembyIdInput) {
    const { id } = query;

    try {
      const tweet = await this.tweetModel
        .findById(new Types.ObjectId(id))
        .populate([
          {
            path: 'owner',
            select: ['_id', 'username', 'photo'],
          },
        ])
        .lean();

      if (!tweet)
        throw new HttpException("Tweet wasn't found", HttpStatus.BAD_REQUEST);

      // best comments
      const bestComment = await this.commentModel
        .find({ tweet: id })
        .sort([['createdAt', 1]])
        .limit(3)
        .populate([
          {
            path: 'owner',
            select: ['_id', 'username', 'photo'],
          },
        ])
        .lean();

      const result = {
        ...tweet,
        comments: bestComment,
      };

      return result;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async deleteTweet(
    deleteTweetInput: DeleteTweetInput,
    isExsistRole: boolean,
    currentUser: ICurrentUser,
  ) {
    const { tweetId } = deleteTweetInput;

    try {
      const tweet = await this.getTweetById({ id: tweetId });

      if (!isExsistRole) {
        const isOwner = String(tweet.owner._id) === String(currentUser._id);
        if (!isOwner)
          throw new HttpException(
            "Forbidden, haven't access",
            HttpStatus.FORBIDDEN,
          );
      }

      // delete media fro s3
      for (const media of tweet.media) {
        const { key } = media;
        await this.s3Service.delete(key);
      }

      await this.tweetModel.findByIdAndRemove(new Types.ObjectId(tweetId));
      await this.commentModel.deleteMany({ tweet: tweetId }); // delete comment of tweet

      return { _id: tweetId };
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async updateTweet(
    updateTweetInput: UpdateTweetInput,
    currentUser: ICurrentUser,
  ) {
    const { tweetId, description } = updateTweetInput;

    try {
      const tweet = await this.getTweetById({ id: tweetId });

      const isOwner = String(tweet.owner._id) === String(currentUser._id);
      if (!isOwner)
        throw new HttpException(
          "Forbidden, haven't access",
          HttpStatus.FORBIDDEN,
        );

      await this.tweetModel.findByIdAndUpdate(new Types.ObjectId(tweetId), {
        description,
      });

      return { ...tweet, description };
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
