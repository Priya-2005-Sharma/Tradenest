import { Router } from 'express';
import {
  listOrders,
  getOrder,
  createOrder,
  updateOrder,
  cancelOrder,
} from '../controllers/order.controller.js';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import {
  createOrderSchema,
  updateOrderSchema,
  orderQuerySchema,
} from '../validators/trading.validators.js';

const router = Router();

router.use(requireAuth);

router
  .route('/')
  .get(validate(orderQuerySchema, 'query'), listOrders)
  .post(validate(createOrderSchema), createOrder);

router
  .route('/:id')
  .get(getOrder)
  .put(validate(updateOrderSchema), updateOrder)
  .delete(cancelOrder);

export default router;
