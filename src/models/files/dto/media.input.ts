import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class MediaInput {
  @Field(() => String)
  urlFile: string;

  @Field(() => String)
  key: string;
}
