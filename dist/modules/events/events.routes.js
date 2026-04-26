import { Router } from 'express';
import { create, getAll, getOne, getMine, update, cancel, publish, adminGetAll, } from './events.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { adminMiddleware } from '../../middlewares/role.middleware.js';
const router = Router();
// Public routes — no auth required
router.get('/', getAll);
router.get('/:id', getOne);
// Protected routes — must be logged in
router.post('/', authMiddleware, create);
router.get('/my/events', authMiddleware, getMine);
router.patch('/:id', authMiddleware, update);
router.patch('/:id/cancel', authMiddleware, cancel);
router.patch('/:id/publish', authMiddleware, publish);
// Admin only routes
router.get('/admin/all', authMiddleware, adminMiddleware, adminGetAll);
export default router;
//# sourceMappingURL=events.routes.js.map