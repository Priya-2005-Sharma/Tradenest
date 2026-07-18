import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { env, isProduction } from './config/env.js';

export const createApp = () => {
  const app = express();

  // Required for correct client IPs (rate limiting) behind a proxy/load balancer.
  app.set('trust proxy', 1);

  app.use(helmet());
  app.use(
    cors({
      origin: env.clientOrigin.split(',').map((o) => o.trim()),
      // Cookies only travel cross-origin when credentials are allowed.
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  // Request logs would bury the test reporter's output.
  if (env.nodeEnv !== 'test') app.use(morgan(isProduction ? 'combined' : 'dev'));

  app.use(
    '/api',
    rateLimit({
      windowMs: 60 * 1000,
      max: isProduction ? 120 : 10_000,
      standardHeaders: true,
      legacyHeaders: false,
      message: { success: false, message: 'Too many requests. Please slow down.' },
    }),
  );

  app.use('/api', routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
