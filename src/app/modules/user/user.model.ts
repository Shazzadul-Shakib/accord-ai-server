import { model, Schema } from 'mongoose';
import { IUser, IUserModel } from './user.interface';
import config from '../../config';
import bcrypt from 'bcrypt';

const userSchema = new Schema<IUser, IUserModel>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// ----- hash pasword ----- //
userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, Number(config.salt_round));
  next();
});

//  ----- check if user exist by email ----- //
userSchema.statics.isUserExistByEmail = async function (email: string) {
  return await UserModel.findOne({ email });
};

export const UserModel = model<IUser, IUserModel>('User', userSchema);
