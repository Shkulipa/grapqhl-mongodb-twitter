import { InputType, Field } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';

@InputType()
export class GetItembyIdInput {
  @Field(() => String)
  @IsMongoId()
  readonly id: string;
}
