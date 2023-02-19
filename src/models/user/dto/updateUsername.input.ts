import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateUsernameInput {
  @Field(() => String)
  readonly newUsername: string;
}
