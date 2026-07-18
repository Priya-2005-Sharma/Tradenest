import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getOrCreateFund } from '../services/trading.service.js';
import { notify } from '../services/notification.service.js';
import { getPortfolioSummary } from '../services/portfolio.service.js';

const round = (n) => Number(n.toFixed(2));

const serialize = (fund, summary) => ({
  availableBalance: round(fund.availableBalance),
  usedMargin: round(fund.usedMargin),
  totalDeposits: round(fund.totalDeposits),
  totalWithdrawals: round(fund.totalWithdrawals),
  // What the account is worth in total: idle cash plus the market value of
  // everything currently held.
  equity: round(fund.availableBalance + (summary?.currentValue ?? 0)),
  transactions: [...fund.transactions]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 50),
});

export const getFunds = asyncHandler(async (req, res) => {
  const [fund, summary] = await Promise.all([
    getOrCreateFund(req.user._id),
    getPortfolioSummary(req.user._id),
  ]);
  res.json({ success: true, data: { funds: serialize(fund, summary) } });
});

export const deposit = asyncHandler(async (req, res) => {
  const { amount, note } = req.body;
  const fund = await getOrCreateFund(req.user._id);

  fund.availableBalance = round(fund.availableBalance + amount);
  fund.transactions.push({ type: 'DEPOSIT', amount, note: note || 'Funds added' });
  await fund.save();

  await notify(req.user._id, {
    type: 'FUNDS',
    title: 'Funds added',
    message: `₹${amount.toLocaleString('en-IN')} credited to your account.`,
  });

  const summary = await getPortfolioSummary(req.user._id);
  res.json({ success: true, message: 'Funds added', data: { funds: serialize(fund, summary) } });
});

export const withdraw = asyncHandler(async (req, res) => {
  const { amount, note } = req.body;
  const fund = await getOrCreateFund(req.user._id);

  if (fund.availableBalance < amount) {
    throw ApiError.badRequest(
      `You cannot withdraw ₹${amount.toLocaleString('en-IN')} — only ₹${fund.availableBalance.toLocaleString('en-IN')} is available.`,
    );
  }

  fund.availableBalance = round(fund.availableBalance - amount);
  fund.transactions.push({ type: 'WITHDRAWAL', amount, note: note || 'Funds withdrawn' });
  await fund.save();

  await notify(req.user._id, {
    type: 'FUNDS',
    title: 'Funds withdrawn',
    message: `₹${amount.toLocaleString('en-IN')} debited from your account.`,
  });

  const summary = await getPortfolioSummary(req.user._id);
  res.json({ success: true, message: 'Withdrawal complete', data: { funds: serialize(fund, summary) } });
});
