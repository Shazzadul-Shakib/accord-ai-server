import express, { type Application } from 'express';
import cors from 'cors';
import { notFound } from './app/middleware/notFound';
import { globalErrorHandler } from './app/middleware/globalErrorHandler';
import { appRoutes } from './app/routes';

export const app: Application = express();

// --- parsers --- //
app.use(express.json());
app.use(cors());

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
