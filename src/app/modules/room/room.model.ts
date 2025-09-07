import { model } from 'mongoose';
import { Types } from 'mongoose';
import { Schema } from 'mongoose';

const chatRoomSchema = new Schema(
  {
    topic: { type: Types.ObjectId, ref: 'TopicRequest', required: true },
    members: [{ type: Types.ObjectId, ref: 'User', index: true }],
  },
  { timestamps: true },
);
export const ChatRoomModel = model('ChatRoom', chatRoomSchema);
