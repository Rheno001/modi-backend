import type { Response, NextFunction } from 'express';
import type { AuthRequest } from '../../middlewares/auth.middleware.js';
import {
    initiateOrder,
    verifyOrder,
    getMyOrders,
    getMyTickets,
    scanTicket,
    handleWebhook,
} from './orders.service.js';
import { sendSuccess, sendError } from '../../utils/response.js';

export const initiate = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { eventId, items, attendee } = req.body;
        let origin = req.body.origin || req.headers.origin;

        // If it's a string array (unlikely for origin header, but safe) take the first
        if (Array.isArray(origin)) origin = origin[0];

        // Fallback to referer if still missing (extract origin from URL)
        if (!origin && req.headers.referer) {
            try {
                const refererUrl = new URL(req.headers.referer);
                origin = refererUrl.origin;
            } catch (e) { /* ignore */ }
        }

        console.log('[Order Controller] Final detected origin:', origin);

        if (!eventId) {
            return sendError(res, 'Event ID is required', 400);
        }

        if (!items || !Array.isArray(items) || items.length === 0) {
            return sendError(res, 'At least one ticket item is required', 400);
        }

        if (!attendee?.firstName || !attendee?.lastName || !attendee?.email) {
            return sendError(res, 'Attendee first name, last name and email are required', 400);
        }

        for (const item of items) {
            if (!item.ticketTypeId) {
                return sendError(res, 'Ticket type ID is required for each item', 400);
            }
            if (!item.quantity || item.quantity < 1) {
                return sendError(res, 'Quantity must be at least 1 for each item', 400);
            }
        }

        // --- SESSION DETECTION ---
        // Detect if the user is logged in during purchase
        let isGuest = true;
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            if (token) {
                try {
                    const { verifyAccessToken } = await import('../../utils/jwt.js');
                    const decoded = verifyAccessToken(token);
                    if (decoded && decoded.userId) {
                        isGuest = false;
                        console.log(`[Order Controller] Authenticated user detected: ${decoded.userId}. Marking order as non-guest.`);
                    }
                } catch (e) {
                    // Invalid token — treat as guest, don't throw (allow purchase to continue)
                    console.log('[Order Controller] Invalid token provided during checkout. Treating as guest order.');
                }
            }
        }

        const result = await initiateOrder(attendee, req.body, isGuest, origin);
        return sendSuccess(res, result, 'Order initiated successfully', 201);
    } catch (err: any) {
        if (
            err.message === 'Event not found' ||
            err.message === 'Event is not available for booking' ||
            err.message.includes('ticket(s) remaining') ||
            err.message === 'Ticket type not found' ||
            err.message === 'Quantity must be at least 1'
        ) {
            return sendError(res, err.message, 400);
        }
        next(err);
    }
};

export const verify = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const { reference } = req.params;
    try {
        console.log('[Order Controller] Starting verification for reference:', reference);
        if (!reference) {
            return sendError(res, 'Reference is required', 400);
        }

        const result = await verifyOrder(reference as string);
        console.log('[Order Controller] Verification successful for reference:', reference);
        return sendSuccess(res, result, 'Order verified successfully', 200);
    } catch (err: any) {
        console.error('[Order Controller] Verification error for reference:', reference, 'Error:', err.message);
        if (err.message === 'Order not found') {
            return sendError(res, err.message, 404);
        }
        if (err.message === 'Payment was not successful') {
            return sendError(res, err.message, 400);
        }
        next(err);
    }
};

export const myOrders = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const orders = await getMyOrders(req.user!.userId);
        return sendSuccess(res, orders, 'Orders fetched successfully', 200);
    } catch (err) {
        next(err);
    }
};

export const myTickets = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const tickets = await getMyTickets(req.user!.userId);
        return sendSuccess(res, tickets, 'Tickets fetched successfully', 200);
    } catch (err) {
        next(err);
    }
};

export const scan = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { code } = req.params;
        if (!code) {
            return sendError(res, 'Ticket code is required', 400);
        }

        const ticket = await scanTicket(code as string, req.user!.userId);
        return sendSuccess(res, ticket, 'Ticket scanned successfully', 200);
    } catch (err: any) {
        if (
            err.message === 'INVALID_TICKET' ||
            err.message === 'ALREADY_USED' ||
            err.message === 'TICKET_CANCELLED'
        ) {
            return sendError(res, err.message, 400);
        }
        next(err);
    }
};

export const webhook = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        await handleWebhook(req.body);
        return res.status(200).send('OK');
    } catch (err) {
        next(err);
    }
};