import { z } from 'zod';

const email = z.string().trim().toLowerCase().email('Enter a valid email address');

const password = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(72, 'Password must be at most 72 characters')
  .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

const phone = z
  .string()
  .trim()
  .regex(/^[0-9+\-\s()]{7,20}$/, 'Enter a valid phone number')
  .optional()
  .or(z.literal(''));

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(60),
  email,
  password,
  phone,
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Password is required'),
});

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(60).optional(),
  email: email.optional(),
  phone,
  profileImage: z.string().trim().max(500).optional().or(z.literal('')),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: password,
});
