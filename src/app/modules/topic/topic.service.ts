import AppError from '../../errorHandlers/appError';
import { sendNotificationToUsers } from '../../utils/socketUtils';
import { ITopicRequest } from './topic.interface';
import { TopicRequestModel } from './topic.model';
import httpStatus from 'http-status';

// ----- create topic request service ----- //
const createTopicRequestService = async (data: ITopicRequest) => {
  const { members, topic, creator } = data;
  const uniqueMembers = [...new Set(members.map(String))];

  if (uniqueMembers.length !== members.length) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Topic request members must be unique',
    );
  }

  const result = await TopicRequestModel.create({
    ...data,
    members: uniqueMembers,
    responses: uniqueMembers.map(u => ({ user: u })),
  });

  // Send real-time notifications to all members
  const notificationData = {
    type: 'topic_request' as const,
    title: topic,
    message: `You've been invited to participate in "${topic}"`,
    data: {
      topicRequestId: result._id,
      topic,
      creator,
    },
    createdAt: new Date(),
  };

  // Filter out the creator from notification recipients
  const notificationRecipients = uniqueMembers.filter(memberId => {
    const creatorString = creator.toString();
    const memberString = memberId.toString();
    return memberString !== creatorString;
  });

  if (notificationRecipients.length > 0) {
    try {
      sendNotificationToUsers(notificationRecipients, notificationData);
    } catch {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Failed to send notifications',
      );
    }
  }

  return result;
};

export const topicServices = {
  createTopicRequestService,
};
