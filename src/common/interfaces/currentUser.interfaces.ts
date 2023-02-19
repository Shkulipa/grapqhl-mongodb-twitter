import { UserDocument } from 'src/models/user/entities/user.entity';

export type ICurrentUser = Pick<
  UserDocument,
  '_id' | 'username' | 'email' | 'roles'
>;
