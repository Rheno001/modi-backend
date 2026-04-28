import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { uploadEventBanner } from '../../utils/upload.js';
import { sendSuccess, sendError } from '../../utils/response.js';
const router = Router();
router.post('/event-banner', authMiddleware, uploadEventBanner.single('banner'), async (req, res) => {
    try {
        if (!req.file) {
            return sendError(res, 'No file uploaded', 400);
        }
        const fileUrl = req.file.path;
        return sendSuccess(res, { url: fileUrl }, 'Banner uploaded successfully', 200);
    }
    catch (err) {
        return sendError(res, err.message || 'Upload failed', 500);
    }
});
export default router;
//# sourceMappingURL=uploads.routes.js.map