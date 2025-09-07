import { catchAsync } from '../../utils/catchAsync';
import { Request, Response } from 'express';
import { sendResponse } from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { topicServices } from './topic.service';
import { JwtPayload } from 'jsonwebtoken';

// ----- create topic request controller ----- //
const createTopicRequest = catchAsync(async (req: Request, res: Response) => {
  const result = await topicServices.createTopicRequestService(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Topic request created successfully',
    data: result,
  });
});

// ----- response on topic request controller ----- //
const updateTopicRequestResponse = catchAsync(
  async (req: Request, res: Response) => {
    const result = await topicServices.updateTopicRequestResponseService(
      req.body,
      req.params.topicRequestId as string,
      req.user as JwtPayload,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Topic request response updated successfully',
      data: result,
    });
  },
);

export const topicController = {
  createTopicRequest,
  updateTopicRequestResponse,
};
