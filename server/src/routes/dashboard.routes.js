import { Router } from 'express';
import { getDashboard } from '../controllers/dashboard.controller.js';
import { getPortfolio } from '../controllers/holding.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/', getDashboard);
router.get('/portfolio', getPortfolio);

export default router;
