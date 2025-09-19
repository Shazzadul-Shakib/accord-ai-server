import { z } from 'zod';
import { Types } from 'mongoose';

// Helper function to validate ObjectId
const objectIdSchema = z
  .string()
  .refine(val => Types.ObjectId.isValid(val), { message: 'Invalid ObjectId' });


// Main topic request validation schema
const topicRequestValidationSchema = z.object({
  topic: z.string().min(1, 'Topic is required'),
  members: z.array(objectIdSchema).min(1, 'At least one member is required'),
});

// ----- update topic request validation schema ----- //
const updateTopicRequestValidationSchema = z.object({
  status: z.enum(['pending', 'active', 'expired']),
});

export const topicRequestValidation = {
  topicRequestValidationSchema,
  updateTopicRequestValidationSchema,
};
