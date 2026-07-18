import { User } from '../models/User.js';
import { Fund } from '../models/Fund.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { signToken, setAuthCookie, clearAuthCookie } from '../services/token.service.js';
import { notify } from '../services/notification.service.js';

const WELCOME_BALANCE = 100_000;

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  const existing = await User.findOne({ email });
  if (existing) throw ApiError.conflict('An account with this email already exists');

  const user = await User.create({ name, email, password, phone: phone || '' });

  // Every new account starts with virtual capital so the platform is usable
  // immediately without a funding step.
  await Fund.create({
    user: user._id,
    availableBalance: WELCOME_BALANCE,
    transactions: [
      { type: 'DEPOSIT', amount: WELCOME_BALANCE, note: 'Welcome bonus — virtual trading capital' },
    ],
  });

  await notify(user._id, {
    type: 'SYSTEM',
    title: 'Welcome to TradeNest',
    message: `Your account is ready with ₹${WELCOME_BALANCE.toLocaleString('en-IN')} in virtual capital.`,
  });

  setAuthCookie(res, signToken(user));
  res.status(201).json({ success: true, message: 'Account created', data: { user } });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  // Same message for unknown email and wrong password so the response cannot
  // be used to enumerate registered accounts.
  if (!user || !(await user.comparePassword(password))) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  setAuthCookie(res, signToken(user));
  user.password = undefined;
  res.json({ success: true, message: 'Logged in', data: { user } });
});

export const logout = asyncHandler(async (_req, res) => {
  clearAuthCookie(res);
  res.json({ success: true, message: 'Logged out' });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { user: req.user } });
});
