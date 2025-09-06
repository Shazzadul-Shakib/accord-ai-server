import AppError from '../../errorHandlers/appError';
import { ITopicRequest } from './topic.interface';
import { TopicRequestModel } from './topic.model';
import httpStatus from 'http-status';

// ----- create topic request service ----- //
const createTopicRequestService = async (data: ITopicRequest) => {
  const { members } = data;
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
  //   here i will implement notification to members
  return result;
};

export const topicServices = {
  createTopicRequestService,
};
