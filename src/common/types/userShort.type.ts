import { ObjectType, PickType } from '@nestjs/graphql';
import { UserType } from 'src/models/user/types/user.type';

@ObjectType()
export class UserShortType extends PickType(UserType, [
  '_id',
  'username',
  'photo',
]) {}
