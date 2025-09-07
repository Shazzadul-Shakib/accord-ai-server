import { Types } from 'mongoose';

export interface ITopicResponse {
  user: Types.ObjectId;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface ITopicRequest {
  creator: Types.ObjectId;
  topic: string;
  members: Types.ObjectId[];
  status: 'pending' | 'active' | 'expired';
  responses: ITopicResponse[];
  createdAt: Date;
  updatedAt: Date;
}
