import { Router } from 'express';
import { topicController } from './topic.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { topicRequestValidation } from './topic.validation';

export const topicRouter = Router();

topicRouter.post(
  '/create-topic-request',
  validateRequest({
    body: topicRequestValidation.topicRequestValidationSchema,
  }),
  topicController.createTopicRequest,
);
