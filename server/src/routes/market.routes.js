import { Router } from 'express';
import {
  listInstruments,
  getInstrumentQuote,
  getMovers,
  getOverview,
  getNews,
} from '../controllers/market.controller.js';

const router = Router();

// Market data is public — the landing page shows live indices before login.
router.get('/instruments', listInstruments);
router.get('/overview', getOverview);
router.get('/movers', getMovers);
router.get('/news', getNews);
router.get('/quote/:symbol', getInstrumentQuote);

export default router;
