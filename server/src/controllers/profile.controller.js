import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { signToken, setAuthCookie, clearAuthCookie } from '../services/token.service.js';

export const getProfile = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { user: req.user } });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, phone, profileImage } = req.body;

  if (email && email !== req.user.email) {
    const taken = await User.findOne({ email, _id: { $ne: req.user._id } });
    if (taken) throw ApiError.conflict('That email is already in use');
    req.user.email = email;
  }

  if (name !== undefined) req.user.name = name;
  if (phone !== undefined) req.user.phone = phone;
  if (profileImage !== undefined) req.user.profileImage = profileImage;

  await req.user.save();

  // The JWT carries the email, so reissue it to keep the cookie in sync.
  setAuthCookie(res, signToken(req.user));

  res.json({ success: true, message: 'Profile updated', data: { user: req.user } });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.comparePassword(currentPassword))) {
    throw ApiError.badRequest('Your current password is incorrect');
  }

  user.password = newPassword;
  await user.save();

  // Force a fresh login so any other session holding the old token is dropped.
  clearAuthCookie(res);
  res.json({ success: true, message: 'Password changed. Please log in again.' });
});
