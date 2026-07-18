import { Router } from 'express';
import {
  listPositions,
  createPosition,
  updatePosition,
  deletePosition,
} from '../controllers/position.controller.js';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import { createPositionSchema, updatePositionSchema } from '../validators/trading.validators.js';

const router = Router();

router.use(requireAuth);

router.route('/').get(listPositions).post(validate(createPositionSchema), createPosition);
router.route('/:id').put(validate(updatePositionSchema), updatePosition).delete(deletePosition);

export default router;
