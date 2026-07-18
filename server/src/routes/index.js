import { Router } from 'express';
import authRoutes from './auth.routes.js';
import profileRoutes from './profile.routes.js';
import holdingRoutes from './holding.routes.js';
import watchlistRoutes from './watchlist.routes.js';
import orderRoutes from './order.routes.js';
import positionRoutes from './position.routes.js';
import fundRoutes from './fund.routes.js';
import marketRoutes from './market.routes.js';
import notificationRoutes from './notification.routes.js';
import dashboardRoutes from './dashboard.routes.js';

const router = Router();

router.get('/health', (_req, res) =>
  res.json({ success: true, status: 'ok', uptime: process.uptime() }),
);

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/holdings', holdingRoutes);
router.use('/watchlist', watchlistRoutes);
router.use('/orders', orderRoutes);
router.use('/positions', positionRoutes);
router.use('/funds', fundRoutes);
router.use('/market', marketRoutes);
router.use('/notifications', notificationRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
