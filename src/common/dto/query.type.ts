import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class QueryInput {
  @Field(() => Int)
  readonly limit: number;

  @Field(() => Int)
  readonly page: number;
}
