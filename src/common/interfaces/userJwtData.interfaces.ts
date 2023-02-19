import { UserDocument } from 'src/models/user/entities/user.entity';

export type IUserJtwData = Pick<UserDocument, '_id'>;
