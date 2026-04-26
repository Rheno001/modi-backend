import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import authRoutes from './modules/auth/auth.routes.js';
import eventRoutes from './modules/events/events.routes.js';
import orderRoutes from './modules/orders/orders.routes.js';

const app = express();

app.use(helmet());

app.use(cors({
    origin: [env.clientUrl, 'http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174', 'https://modi-events.netlify.app'],
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/health', (req, res) => {
    res.status(200).json({ success: true, message: 'Modi server is running' });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/orders', orderRoutes);

app.use(errorMiddleware);

export default app;