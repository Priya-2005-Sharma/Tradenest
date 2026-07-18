import { createApp } from './app.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';

const start = async () => {
  try {
    await connectDatabase();

    const app = createApp();
    const server = app.listen(env.port, () => {
      logger.info(`TradeNest API listening on http://localhost:${env.port} (${env.nodeEnv})`);
    });

    const shutdown = async (signal) => {
      logger.info(`${signal} received — shutting down.`);
      server.close(async () => {
        await disconnectDatabase();
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();
