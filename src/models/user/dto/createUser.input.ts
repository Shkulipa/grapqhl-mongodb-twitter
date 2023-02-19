import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  @MinLength(4)
  readonly username: string;

  @Field(() => String)
  @IsEmail()
  readonly email: string;

  @Field(() => String)
  @MinLength(6)
  readonly password: string;

  @Field(() => String)
  @MinLength(6)
  readonly confirmPassword: string;
}
