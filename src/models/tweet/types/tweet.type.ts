import { ObjectType, Field } from '@nestjs/graphql';
import { OwnerType } from 'src/common/types/owner.type';
import { IMedia } from 'src/models/files/interfaces/media.interfaces';
import { MediaObject } from 'src/models/files/types/media.type';

@ObjectType()
export class TweetType {
  @Field(() => String)
  _id: string;

  @Field(() => OwnerType)
  owner: OwnerType;

  @Field(() => String)
  description: string;

  @Field(() => [MediaObject])
  media: IMedia[];

  @Field(() => String)
  createdAt: string;
}
