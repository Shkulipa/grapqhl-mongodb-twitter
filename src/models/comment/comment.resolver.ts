import { RolesGuard } from './../../common/guards/roles.guard';
import { Resolver, Mutation, Args, Query, Subscription } from '@nestjs/graphql';
import { CommentService } from './comment.service';
import { CreateCommentInput } from './dto/createComment.input';
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ICurrentUser } from 'src/common/interfaces/currentUser.interfaces';
import { GetCommentsType } from './types/getComments.type';
import { GetCommentsInput } from './dto/getComments.input';
import { EUserRoles } from 'src/common/interfaces/userRoles.interfaces';
import { Roles } from 'src/common/decorators/roles.decorator';
import { DeleteCommentInput } from './dto/deleteComment.input';
import { CreateCommentType } from './types/createComment.type';
import { DeleteCommentType } from './types/deleteComment.type';
import { UpdateCommentType } from './types/updateComment.type';
import { UpdateCommentInput } from './dto/updateComment.input';
import { IsExsistRole } from 'src/common/decorators/isExsistRole.decorator';
import { pubSub } from 'src/common/constants/pubSub';
import { SubscriptionType } from './types/subscriptionComment.type';

enum EAction {
  ADD_COMMENT = 'ADD_COMMENT',
  DELETE_COMMENT = 'DELETE_COMMENT',
  UPDATE_COMMENT = 'UPDATE_COMMENT',
}

@Resolver()
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  @Mutation((returns) => CreateCommentType)
  async createComment(
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    const newComment = await this.commentService.create(
      createCommentInput,
      currentUser,
    );
    pubSub.publish(`tweet_${createCommentInput.tweetId}_comment`, {
      action: EAction.ADD_COMMENT,
      comment: newComment,
    });
    return newComment;
  }

  @UsePipes(new ValidationPipe())
  @Query((returns) => GetCommentsType)
  getComments(@Args('getCommentsInput') getCommentsInput: GetCommentsInput) {
    return this.commentService.getComments(getCommentsInput);
  }

  @Roles(EUserRoles.DELETE_ANY_COMMENT)
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe())
  @Mutation((returns) => DeleteCommentType)
  async deleteComment(
    @Args('deleteCommentInput') deleteCommentInput: DeleteCommentInput,
    @IsExsistRole() isExsistRole: boolean,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    const { _id, comment } = await this.commentService.deleteComment(
      deleteCommentInput,
      currentUser,
      isExsistRole,
    );

    pubSub.publish(`tweet_${comment.tweet._id}_comment`, {
      action: EAction.DELETE_COMMENT,
      comment: { _id },
    });

    return { _id };
  }

  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  @Mutation((returns) => UpdateCommentType)
  async updateComment(
    @Args('updateCommentInput') updateCommentInput: UpdateCommentInput,
  ) {
    const updatedComment = await this.commentService.updateComment(
      updateCommentInput,
    );
    pubSub.publish(`tweet_${updatedComment.tweet._id}_comment`, {
      action: EAction.UPDATE_COMMENT,
      comment: updatedComment,
    });
    return updatedComment;
  }

  @Subscription((returns) => SubscriptionType, {
    resolve(payload, args, context, info) {
      return payload;
    },
  })
  comment(@Args({ name: 'tweetId', type: () => String }) tweetId: string) {
    console.log(tweetId);
    return pubSub.asyncIterator(`tweet_${tweetId}_comment`);
  }
}
