import { Notification } from '../models/Notification.js';
import { logger } from '../utils/logger.js';

/**
 * Notifications are a side effect of trading actions — a failure here must
 * never roll back the order or fund movement that triggered it.
 */
export const notify = async (userId, { type, title, message }) => {
  try {
    return await Notification.create({ user: userId, type, title, message });
  } catch (error) {
    logger.error('Failed to create notification:', error.message);
    return null;
  }
};
