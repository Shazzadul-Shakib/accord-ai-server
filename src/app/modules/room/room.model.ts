import { model, Types, Schema } from 'mongoose';

const summarySchema = new Schema({
  title: { type: String },
  description: { type: String },
  points: [
    {
      time: { type: String },
      event: { type: String },
    },
  ],
  conclusions: [{ type: String }],
  metadata: {
    wordCount: { type: Number },
    participantCount: { type: Number },
    timestamp: { type: String },
  },
});

const chatRoomSchema = new Schema(
  {
    topic: { type: Types.ObjectId, ref: 'TopicRequest', required: true },
    members: [{ type: Types.ObjectId, ref: 'User', index: true }],
    summary: { type: summarySchema, default: null },
  },
  { timestamps: true },
);

export const ChatRoomModel = model('ChatRoom', chatRoomSchema);
