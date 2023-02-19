import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { hash } from 'bcrypt';
import { HydratedDocument } from 'mongoose';
import { EUserRoles } from 'src/common/interfaces/userRoles.interfaces';

const arrayRoles: EUserRoles[] = [
  ...Object.keys(EUserRoles).map((key) => EUserRoles[key]),
];

export type UserDocument = HydratedDocument<User>;

@Schema({
  versionKey: false,
  timestamps: { createdAt: 'createdAt', updatedAt: false },
})
export class User {
  @Prop({ required: true, unique: true, type: String })
  email: string;

  @Prop({ required: true, unique: true, type: String })
  username: string;

  @Prop({ required: true, type: String })
  password: string;

  @Prop({ type: String, default: null })
  photo: string;

  @Prop({ required: true, type: Array, enum: [...arrayRoles], default: [] })
  roles: EUserRoles[];

  @Prop({ type: String, default: null })
  refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next: any) {
  if (!this.isModified('password')) return next();
  this.password = await hash(this.password, 10);
  next();
});
