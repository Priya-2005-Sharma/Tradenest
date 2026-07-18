import { Router } from 'express';
import { getProfile, updateProfile, changePassword } from '../controllers/profile.controller.js';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import { updateProfileSchema, changePasswordSchema } from '../validators/auth.validators.js';

const router = Router();

router.use(requireAuth);

router.get('/', getProfile);
router.put('/', validate(updateProfileSchema), updateProfile);
router.put('/password', validate(changePasswordSchema), changePassword);

export default router;
