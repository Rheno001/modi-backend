import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const eventBannerStorage = new CloudinaryStorage({
    cloudinary,
    params: async () => ({
        folder: 'modi/event-banners',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [
            { width: 1200, height: 630, crop: 'fill', gravity: 'auto' },
            { quality: 'auto', fetch_format: 'auto' },
        ],
    }),
});

export const uploadEventBanner = multer({
    storage: eventBannerStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
});