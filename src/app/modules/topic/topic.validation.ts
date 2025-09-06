import { z } from 'zod';
import { Types } from 'mongoose';

// Helper function to validate ObjectId
const objectIdSchema = z.string().refine(
  (val) => Types.ObjectId.isValid(val),
  { message: 'Invalid ObjectId' }
);

// Response schema
const responseSchema = z.object({
  user: objectIdSchema,
  status: z.enum(['pending', 'accepted', 'rejected']).default('pending')
});

// Main topic request validation schema
 const topicRequestValidationSchema = z.object({
  creator: objectIdSchema,
  topic: z.string().min(1, 'Topic is required'),
  members: z.array(objectIdSchema).min(1, 'At least one member is required'),
  responses: z.array(responseSchema).optional().default([])
});

export const topicRequestValidation = {
  topicRequestValidationSchema,
}
