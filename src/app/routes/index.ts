import { Router } from 'express';
import { userRouter } from '../modules/user/user.routes';
import { topicRouter } from '../modules/topic/topic.routes';
import { notificationRouter } from '../modules/notification/notification.routes';
import { roomRouter } from '../modules/room/room.routes';

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
  {
    path: '/notification',
    router: notificationRouter,
  },
  {
    path: '/room',
    router: roomRouter,
  },
  
];

moduleRoutes.forEach(route => {
  appRoutes.use(route.path, route.router);
});
