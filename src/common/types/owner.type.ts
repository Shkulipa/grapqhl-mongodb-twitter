import { ObjectType, PickType } from '@nestjs/graphql';
import { UserType } from 'src/models/user/types/user.type';

@ObjectType()
export class OwnerType extends PickType(UserType, [
  '_id',
  'username',
  'photo',
]) {}
