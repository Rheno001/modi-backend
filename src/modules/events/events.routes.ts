import { Router } from 'express';
import {
    create,
    getAll,
    getOne,
    getMine,
    update,
    cancel,
    publish,
    adminGetAll,
} from './events.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { adminMiddleware } from '../../middlewares/role.middleware.js';

const router = Router();

// Public routes — no auth required
router.get('/', getAll);

// Protected routes — must be logged in
router.post('/', authMiddleware, create);
router.get('/my/events', authMiddleware, getMine);
router.get('/my/:id', authMiddleware, getOne); // We can reuse getOne if we make it smarter or add a specific one
router.patch('/:id', authMiddleware, update);
router.patch('/:id/cancel', authMiddleware, cancel);
router.patch('/:id/publish', authMiddleware, publish);

// Catch-all ID route (must be last among ID routes)
router.get('/:id', getOne);

// Admin only routes
router.get('/admin/all', authMiddleware, adminMiddleware, adminGetAll);

export default router;