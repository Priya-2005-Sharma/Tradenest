import { Router } from 'express';
import {
  listWatchlist,
  addToWatchlist,
  updateWatchlistItem,
  removeFromWatchlist,
} from '../controllers/watchlist.controller.js';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import { createWatchlistSchema, updateWatchlistSchema } from '../validators/trading.validators.js';

const router = Router();

router.use(requireAuth);

router.route('/').get(listWatchlist).post(validate(createWatchlistSchema), addToWatchlist);
router
  .route('/:id')
  .put(validate(updateWatchlistSchema), updateWatchlistItem)
  .delete(removeFromWatchlist);

export default router;
