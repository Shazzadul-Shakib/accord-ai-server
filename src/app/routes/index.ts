import { Router } from 'express';
import { userRouter } from '../modules/user/user.routes';
import { topicRouter } from '../modules/topic/topic.routes';

export const appRoutes = Router();

const moduleRoutes = [
  {
    path: '/user',
    router: userRouter,
  },
  {
    path: '/topic',
    router: topicRouter,
  },
];

moduleRoutes.forEach(route => {
  appRoutes.use(route.path, route.router);
});
