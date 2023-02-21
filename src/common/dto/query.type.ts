import { InputType, Field, Int } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';

@InputType()
export class QueryInput {
  @Max(50)
  @Min(1)
  @Field(() => Int)
  readonly limit: number;

  @Min(1)
  @Field(() => Int)
  readonly page: number;
}
