import { Router } from 'express';
import { topicController } from './topic.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { topicRequestValidation } from './topic.validation';
import { authGuard } from '../../middleware/authGuard';

export const topicRouter = Router();

topicRouter.post(
  '/create-topic-request',
  authGuard(),
  validateRequest({
    body: topicRequestValidation.topicRequestValidationSchema,
  }),
  topicController.createTopicRequest,
);

