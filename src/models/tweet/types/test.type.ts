import { ObjectType, Field } from '@nestjs/graphql';
import { OwnerType } from 'src/common/types/owner.type';
import { IMedia } from 'src/models/files/interfaces/media.interfaces';
import { MediaObject } from 'src/models/files/types/media.type';

@ObjectType()
export class TestType {
  @Field(() => String)
  _id: string;
}
