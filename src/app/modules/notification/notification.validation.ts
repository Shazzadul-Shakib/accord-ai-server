import { z } from 'zod';
import { Types } from 'mongoose';

// Validate MongoDB ObjectId
const objectIdSchema = z
  .string()
  .refine(val => Types.ObjectId.isValid(val), { message: 'Invalid ObjectId' });

// Notification data schema
const notificationDataSchema = z.object({
  type: z.enum(['topic_request', 'topic_response', 'message', 'system']),
  title: z.string(),
  message: z.string(),
  data: z.any().optional().default({}),
  createdAt: z
    .date()
    .optional()
    .default(() => new Date()),
});

// Main notification schema
const notificationValidationSchema = z.object({
  recipientId: objectIdSchema,
  senderId: objectIdSchema.optional(),
  data: notificationDataSchema.optional(),
  isRead: z.boolean().default(false),
});

// Schema for updating a notification
const updateNotificationValidationSchema =
  notificationValidationSchema.partial();

export const notificationValidations = {
  notificationValidationSchema,
  updateNotificationValidationSchema,
};
