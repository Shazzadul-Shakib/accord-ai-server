import express, { type Application } from 'express';
import cors from 'cors';
import { notFound } from './app/middleware/notFound';
import { globalErrorHandler } from './app/middleware/globalErrorHandler';
import { appRoutes } from './app/routes';
import cookieParser from 'cookie-parser';

const app: Application = express();

// --- parsers --- //
app.use(express.json());
app.use(
  cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);
app.use(cookieParser());

// ----- root route ----- //
app.get('/', (_, res) => {
  res.send({ message: 'Accord AI server is running...' });
});

// --- routes --- //
app.use('/api', appRoutes);

// ----- global error handler ----- //
app.use(globalErrorHandler);

// ----- API not found handler ----- //
app.use(notFound);

export default app;
