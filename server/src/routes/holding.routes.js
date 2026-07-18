import { Router } from 'express';
import {
  listHoldings,
  createHolding,
  updateHolding,
  deleteHolding,
} from '../controllers/holding.controller.js';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import { createHoldingSchema, updateHoldingSchema } from '../validators/trading.validators.js';

const router = Router();

router.use(requireAuth);

router.route('/').get(listHoldings).post(validate(createHoldingSchema), createHolding);
router.route('/:id').put(validate(updateHoldingSchema), updateHolding).delete(deleteHolding);

export default router;
