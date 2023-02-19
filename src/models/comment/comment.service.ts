import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ICurrentUser } from 'src/common/interfaces/currentUser.interfaces';
import { Tweet, TweetDocument } from '../tweet/entity/tweet.entity';
import { CreateCommentInput } from './dto/createComment.input';
import { DeleteCommentInput } from './dto/deleteComment.input';
import { GetCommentsInput } from './dto/getComments.input';
import { UpdateCommentInput } from './dto/updateComment.input';
import { CommentDocument, Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
    @InjectModel(Tweet.name)
    private readonly tweetModel: Model<TweetDocument>,
  ) {}

  private readonly logger = new Logger(CommentService.name);

  async create(
    createCommentInput: CreateCommentInput,
    currentUser: ICurrentUser,
  ) {
    const { comment, tweetId } = createCommentInput;

    try {
      const tweet = await this.tweetModel.findById(tweetId).populate([
        {
          path: 'owner',
          select: ['_id', 'username', 'photo'],
        },
      ]);

      if (!tweet)
        throw new HttpException("Tweet wasn't found", HttpStatus.BAD_REQUEST);

      const newComment = await this.commentModel.create({
        tweet: tweetId,
        owner: currentUser._id,
        comment,
      });

      return {
        _id: newComment._id,
        tweet,
        owner: tweet.owner,
        comment,
      };
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async updateComment(updateCommentInput: UpdateCommentInput) {
    const { comment: newComment, commentId } = updateCommentInput;

    try {
      const comment = await this.commentModel.findById(commentId).populate([
        {
          path: 'owner',
          select: ['_id', 'username', 'photo'],
        },
        {
          path: 'tweet',
          select: ['_id'],
        },
      ]);

      if (!comment)
        throw new HttpException("Tweet wasn't found", HttpStatus.BAD_REQUEST);

      comment.comment = newComment;
      await comment.save();

      return comment;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async getComments(getCommentsInput: GetCommentsInput) {
    const { limit, page, tweetId } = getCommentsInput;

    try {
      const tweet = await this.tweetModel.findById(tweetId);

      if (!tweet)
        throw new HttpException("Tweet wasn't found", HttpStatus.BAD_REQUEST);

      const comments = await this.commentModel
        .find({
          tweet: tweetId,
        })
        .skip(limit * page - limit)
        .limit(limit)
        .sort([['createdAt', 1]])
        .populate([
          {
            path: 'owner',
            select: ['_id', 'username', 'photo'],
          },
        ])
        .lean();

      const totalCount = await this.commentModel
        .find({
          tweet: tweetId,
        })
        .count();

      return {
        totalCount,
        comments,
      };
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async deleteComment(
    deleteCommentInput: DeleteCommentInput,
    currentUser: ICurrentUser,
    isExsistRole: boolean,
  ) {
    const { commentId } = deleteCommentInput;

    try {
      const comment = await this.getCommentById(commentId);

      if (!isExsistRole) {
        const isOwner = String(comment.owner._id) === String(currentUser._id);
        if (!isOwner)
          throw new HttpException(
            "Forbidden, haven't access",
            HttpStatus.FORBIDDEN,
          );
      }

      await this.commentModel.findByIdAndRemove(new Types.ObjectId(commentId));

      return { _id: commentId, comment };
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async getCommentById(id: string) {
    try {
      const comment = await this.commentModel
        .findById(new Types.ObjectId(id))
        .populate([
          {
            path: 'owner',
            select: ['_id', 'username'],
          },
          {
            path: 'tweet',
            select: ['_id', 'description', 'media'],
            populate: [
              {
                path: 'owner',
                select: ['_id', 'username'],
              },
            ],
          },
        ])
        .lean();

      if (!comment)
        throw new HttpException("Comment wasn't found", HttpStatus.BAD_REQUEST);

      return comment;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
