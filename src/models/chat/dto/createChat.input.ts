import { InputType, Field } from '@nestjs/graphql';
import { IsArray, ArrayMinSize, IsMongoId } from 'class-validator';

@InputType()
export class CreateChatInput {
  @ArrayMinSize(1)
  @IsArray()
  @IsMongoId({ each: true })
  @Field(() => [String])
  members: string[];
}
