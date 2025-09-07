import { model } from 'mongoose';
import { Schema, Types } from 'mongoose';
import { ITopicRequest } from './topic.interface';

const topicRequestSchema = new Schema(
  {
    creator: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    topic: { type: String, required: true, index: true },
    members: [{ type: Types.ObjectId, ref: 'User', required: true }],
    status: {
      type: String,
      enum: ['pending', 'active', 'expired'],
      default: 'pending',
      index: true,
    },
    responses: [
      {
        user: { type: Types.ObjectId, ref: 'User', required: true },
        status: {
          type: String,
          enum: ['pending', 'accepted', 'rejected'],
          default: 'pending',
        },
      },
    ],
  },
  { timestamps: true },
);
topicRequestSchema.index({ 'responses.user': 1 });

export const TopicRequestModel = model<ITopicRequest>(
  'TopicRequest',
  topicRequestSchema,
);
