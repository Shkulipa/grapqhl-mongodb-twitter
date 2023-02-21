import { ObjectType, Field } from '@nestjs/graphql';
import { UserShortType } from 'src/common/types/userShort.type';

import { IMedia } from 'src/models/files/interfaces/media.interfaces';
import { MediaObject } from 'src/models/files/types/media.type';

@ObjectType()
export class TweetType {
  @Field(() => String)
  _id: string;

  @Field(() => UserShortType)
  owner: UserShortType;

  @Field(() => String)
  description: string;

  @Field(() => [MediaObject])
  media: IMedia[];

  @Field(() => String)
  createdAt: string;
}
