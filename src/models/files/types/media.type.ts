import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MediaObject {
  @Field(() => String)
  urlFile: string;

  @Field(() => String)
  key: string;
}
