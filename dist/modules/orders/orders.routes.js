import { Router } from 'express';
import { initiate, verify, myOrders, myTickets, scan, webhook, } from './orders.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
const router = Router();
// Webhook — no auth
router.post('/webhook', webhook);
// Initiate — public, guests allowed
router.post('/initiate', initiate);
// Verify — public, guests need to see their tickets too
router.get('/verify/:reference', verify);
// Protected — must be logged in
router.get('/my-orders', authMiddleware, myOrders);
router.get('/my-tickets', authMiddleware, myTickets);
router.post('/scan/:code', authMiddleware, scan);
export default router;
//# sourceMappingURL=orders.routes.js.map