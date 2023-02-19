import { ObjectType, Field } from '@nestjs/graphql';
import { CommentType } from './comment.type';

@ObjectType()
export class SubscriptionType {
  @Field(() => String)
  action: string;

  @Field(() => CommentType)
  comment: CommentType;
}
