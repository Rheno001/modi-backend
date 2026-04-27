import { Router } from 'express';
import type { Response } from 'express';
import type { AuthRequest } from '../../middlewares/auth.middleware.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { uploadEventBanner } from '../../utils/upload.js';
import { sendSuccess, sendError } from '../../utils/response.js';

const router = Router();

router.post(
    '/event-banner',
    authMiddleware,
    uploadEventBanner.single('banner'),
    async (req: AuthRequest, res: Response) => {
        try {
            if (!req.file) {
                return sendError(res, 'No file uploaded', 400);
            }

            const fileUrl = (req.file as any).path;
            return sendSuccess(res, { url: fileUrl }, 'Banner uploaded successfully', 200);
        } catch (err: any) {
            return sendError(res, err.message || 'Upload failed', 500);
        }
    }
);

export default router;