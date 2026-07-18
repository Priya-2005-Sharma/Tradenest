import { Router } from 'express';
import { getFunds, deposit, withdraw } from '../controllers/fund.controller.js';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import { fundTransactionSchema } from '../validators/trading.validators.js';

const router = Router();

router.use(requireAuth);

router.get('/', getFunds);
router.post('/deposit', validate(fundTransactionSchema), deposit);
router.post('/withdraw', validate(fundTransactionSchema), withdraw);

export default router;
