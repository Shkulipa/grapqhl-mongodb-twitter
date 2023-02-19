import { InputType, Field } from '@nestjs/graphql';
import { ArrayMaxSize, IsArray, MaxLength, Validate } from 'class-validator';
import { IsURLValidation } from 'src/common/validations/isURL.validation';
import { MediaInput } from 'src/models/files/dto/media.input';
import { IMedia } from 'src/models/files/interfaces/media.interfaces';

@InputType()
export class CreateTweetInput {
  @Field(() => String)
  @MaxLength(500)
  description: string;

  @Field(() => [MediaInput])
  @IsArray()
  @ArrayMaxSize(5)
  @Validate(IsURLValidation)
  media: IMedia[];
}
