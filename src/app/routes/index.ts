import { Router } from 'express';
import { userRouter } from '../modules/user/user.routes';

export const appRoutes = Router();

const moduleRoutes = [
  {
    path: '/user',
    router: userRouter,
  },
];

moduleRoutes.forEach(route => {
  appRoutes.use(route.path, route.router);
});
