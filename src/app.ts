import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';

const app = express();

// Middleware
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ success: true, message: 'Modi server is running' });
});

// Routes
// TODO: mount your routers here, e.g.:
// import authRouter from './modules/auth/auth.routes.js';
// app.use('/api/auth', authRouter);

export default app;
