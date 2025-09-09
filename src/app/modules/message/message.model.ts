import { Schema, model } from 'mongoose';
import { IMessage } from './message.interface';

// Message schema
const messageSchema = new Schema<IMessage>(
  {
    roomId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Room',
    },
    sender: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    text: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Create and export Message model
export const MessageModel = model<IMessage>('Message', messageSchema);
