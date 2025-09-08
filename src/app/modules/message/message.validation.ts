import { z } from 'zod';

const messageValidationSchema = z.object({
  text: z.string().min(1, {
    message: 'Message text cannot be empty',
  }),
});

export const messageValidations = {
  messageValidationSchema,
};
