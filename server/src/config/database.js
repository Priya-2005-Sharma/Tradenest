import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

let memoryServer = null;

/**
 * Resolves the Mongo connection string. When MONGO_URI is unset we spin up an
 * in-process MongoDB so the app runs with zero external setup; pointing at
 * Atlas or a local mongod is purely a .env change.
 */
const resolveUri = async () => {
  if (env.mongoUri) return env.mongoUri;

  const { MongoMemoryServer } = await import('mongodb-memory-server');
  memoryServer = await MongoMemoryServer.create();
  logger.warn('MONGO_URI not set — started in-memory MongoDB (data is not persisted).');
  // getUri() alone yields the default "test" db; name it explicitly.
  return memoryServer.getUri('tradenest');
};

export const connectDatabase = async () => {
  mongoose.set('strictQuery', true);
  const uri = await resolveUri();
  await mongoose.connect(uri);
  logger.info(`MongoDB connected: ${mongoose.connection.name}`);
  return mongoose.connection;
};

export const disconnectDatabase = async () => {
  await mongoose.disconnect();
  if (memoryServer) await memoryServer.stop();
};
