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
  image: z.string().optional(),
});

const userLoginValidatinSchema = z.object({
  email: z.email({
    message: 'Invalid email address',
  }),
  password: z.string({
    message: 'Password is required',
  }),
});

const refreshTokenValidationSchema = z.object({
  refreshToken: z.string({
    message: 'Refresh token is required',
  }),
});

const updateUserProfileValidationSchema = z.object({
  name: z.string({
    message: 'Name is required',
  }).optional(),
  email: z.email({
    message: 'Invalid email address',
  }).optional(),
  password: z
    .string({
      message: 'Password is required',
    })
    .min(6, {
      message: 'Password must be at least 6 characters long',
    })
    .optional(),
  image: z.string().optional(),
}).partial();

export const UserValidations = {
  userValidationSchema,
  userLoginValidatinSchema,
  refreshTokenValidationSchema,
  updateUserProfileValidationSchema,
};
