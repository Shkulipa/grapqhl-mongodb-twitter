import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class LoginUserInput {
  @Field(() => String)
  readonly username: string;

  @Field(() => String)
  readonly password: string;
}
