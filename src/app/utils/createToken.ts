import { sign, Secret, SignOptions } from 'jsonwebtoken';

export const createToken = (
  payload: Record<string, unknown>,
  secret: string,
  expiresTime: string,
): string => {
  return sign(
    payload,
    secret as Secret,
    { expiresIn: expiresTime } as SignOptions,
  );
};
