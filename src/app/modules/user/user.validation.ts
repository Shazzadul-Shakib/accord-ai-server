import z from 'zod';

const userValidationSchema = z.object({
  name: z.string({
    message: 'Name is required',
  }),
  email: z.email({
    message: 'Invalid email address',
  }),
  password: z
    .string({
      message: 'Password is required',
    })
    .min(6, {
      message: 'Password must be at least 6 characters long',
    }),
});

const userLoginValidatinSchema = z.object({
  email: z.email({
    message: 'Invalid email address',
  }),
  password: z.string({
    message: 'Password is required',
  }),
});

export const UserValidations = {
  userValidationSchema,
  userLoginValidatinSchema,
};
