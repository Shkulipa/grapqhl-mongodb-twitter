import { ObjectType, Field } from '@nestjs/graphql';
import { EUserRoles } from 'src/common/interfaces/userRoles.interfaces';

@ObjectType()
export class UserType {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  username: string;

  @Field(() => String)
  email: string;

  @Field(() => String, { nullable: true })
  photo: string;

  @Field(() => [String])
  roles: EUserRoles[];
}
