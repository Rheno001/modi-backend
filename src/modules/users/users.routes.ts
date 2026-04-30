import { Router } from 'express';
import { list, remove } from './users.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { adminMiddleware } from '../../middlewares/role.middleware.js';

const router = Router();

// All user management routes require admin role
router.use(authMiddleware, adminMiddleware);

router.get('/', list);
router.delete('/:id', remove);

export default router;
