import { Types } from 'mongoose';
import AppError from '../../errorHandlers/appError';
import { sendNotificationToUsers } from '../../utils/socketUtils';
import { NotificationModel } from '../notification/notification.model';
import { ChatRoomModel } from '../room/room.model';
import { ITopicRequest, ITopicResponse } from './topic.interface';
import { TopicRequestModel } from './topic.model';
import { status } from 'http-status';
import { JwtPayload } from 'jsonwebtoken';

// ----- create topic request service ----- //
const createTopicRequestService = async (
  data: Omit<
    ITopicRequest,
    'creator' | 'responses' | 'status' | 'createdAt' | 'updatedAt'
  >,
  user: JwtPayload,
) => {
  const { members, topic } = data;
  const creatorId = new Types.ObjectId(user.userId); // take creator from JWT
  const uniqueMembers = [...new Set(members.map(String))].map(
    id => new Types.ObjectId(id),
  );

  if (uniqueMembers.length !== members.length) {
    throw new AppError(
      status.BAD_REQUEST,
      'Topic request members must be unique',
    );
  }

  const result = await TopicRequestModel.create({
    creator: creatorId,
    topic,
    members: uniqueMembers,
    responses: uniqueMembers.map(u => ({ user: u })),
  });

  // ----- Send real-time notifications to all members except creator ----- //
  const notificationData = {
    type: 'topic_request' as const,
    title: topic,
    message: `You've been invited to participate in "${topic}"`,
    creator: creatorId,
    data: { topicRequestId: result._id, topic },
    createdAt: result.createdAt,
  };

  const notificationRecipients = uniqueMembers.filter(
    memberId => !memberId.equals(creatorId),
  );

  if (notificationRecipients.length > 0) {
    try {
      sendNotificationToUsers(
        notificationRecipients.map(String),
        notificationData,
      );
      await NotificationModel.create(
        notificationRecipients.map(recipient => ({
          recipientId: recipient,
          senderId: creatorId,
          isRead: false,
          topicId: result._id,
        })),
      );
    } catch {
      throw new AppError(
        status.INTERNAL_SERVER_ERROR,
        'Failed to send notifications',
      );
    }
  }

  return result;
};

// ----- update topic request service ----- //
const updateTopicRequestResponseService = async (
  data: ITopicResponse,
  topicRequestId: string,
  user: JwtPayload,
) => {
  const topicRequest = await TopicRequestModel.findById(topicRequestId);
  if (!topicRequest) {
    throw new AppError(status.NOT_FOUND, 'Topic request not found');
  }

  const respondedUser = user.userId;

  // ----- prevent creator from responding ----- //
  if (topicRequest.creator === respondedUser) {
    throw new AppError(
      status.BAD_REQUEST,
      'Creator cannot respond to their own topic request',
    );
  }

  const userStatus = data.status;

  // ----- check if the user already exists in responses ----- //
  const userResponse = topicRequest.responses.find(
    response => response.user.toHexString() === respondedUser,
  );
  if (!userResponse) {
    throw new AppError(
      status.NOT_FOUND,
      'User response not found in topic request',
    );
  }

  // ----- update the user's response ----- //
  const updatedRequest = await TopicRequestModel.findByIdAndUpdate(
    topicRequestId,
    { $set: { 'responses.$[elem].status': userStatus } },
    {
      arrayFilters: [{ 'elem.user': respondedUser }],
      new: true,
    },
  );

  if (!updatedRequest) {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      'Failed to update topic request',
    );
  }
  console.log(data.notificationId);

  await NotificationModel.findByIdAndUpdate(data.notificationId, {
    $set: {
      hasResponse: true,
    },
  });


  // ----- check if the request should now be "active" ----- //
  const atLeastOneAccepted = updatedRequest.responses.some(
    resp => resp.status === 'accepted',
  );

  // ----- check no one accepted ----- //
  const noOneAccepted = updatedRequest.responses.every(
    resp => resp.status !== 'accepted',
  );

  // ----- topic request becomes active with whoever accepted ----- //
  if (atLeastOneAccepted && updatedRequest.status === 'pending') {
    const session = await TopicRequestModel.startSession();
    try {
      session.startTransaction();

      updatedRequest.status = 'active';
      await updatedRequest.save({ session });

      await ChatRoomModel.create(
        [
          {
            topic: updatedRequest._id,
            members: [...updatedRequest.members, updatedRequest.creator],
          },
        ],
        { session },
      );

      await session.commitTransaction();
    } catch {
      await session.abortTransaction();
      throw new AppError(
        status.INTERNAL_SERVER_ERROR,
        'Failed to activate topic request and create chat room',
      );
    } finally {
      session.endSession();
    }
  }
  // ----- topic request expires if no one accepted ----- //
  if (noOneAccepted && updatedRequest.status === 'pending') {
    updatedRequest.status = 'expired';
    await updatedRequest.save();
  }

  return updatedRequest;
};

export const topicServices = {
  createTopicRequestService,
  updateTopicRequestResponseService,
};
