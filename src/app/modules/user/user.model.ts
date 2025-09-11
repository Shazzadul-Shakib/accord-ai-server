import { model, Schema } from 'mongoose';
import { IUser, IUserModel } from './user.interface';
import config from '../../config';
import bcrypt from 'bcrypt';

const userSchema = new Schema<IUser, IUserModel>(
  {
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
    image: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

// ----- hash pasword ----- //
userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, Number(config.salt_round));
  next();
});

//  ----- check if user exist by email ----- //
userSchema.statics.isUserExistByEmail = async function (email: string) {
  return await UserModel.findOne({ email });
};

// ----- check if password matched ----- //
userSchema.statics.isPasswordMatched = async function (
  textPassword: string,
  hashedPassword: string,
) {
  return await bcrypt.compare(textPassword, hashedPassword);
};

export const UserModel = model<IUser, IUserModel>('User', userSchema);
