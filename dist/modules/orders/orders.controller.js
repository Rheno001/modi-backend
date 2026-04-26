import { initiateOrder, verifyOrder, getMyOrders, getMyTickets, scanTicket, handleWebhook, } from './orders.service.js';
import { sendSuccess, sendError } from '../../utils/response.js';
export const initiate = async (req, res, next) => {
    try {
        const { eventId, items, attendee } = req.body;
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
        const result = await initiateOrder(attendee, req.body);
        return sendSuccess(res, result, 'Order initiated successfully', 201);
    }
    catch (err) {
        if (err.message === 'Event not found' ||
            err.message === 'Event is not available for booking' ||
            err.message.includes('ticket(s) remaining') ||
            err.message === 'Ticket type not found' ||
            err.message === 'Quantity must be at least 1') {
            return sendError(res, err.message, 400);
        }
        next(err);
    }
};
export const verify = async (req, res, next) => {
    try {
        const { reference } = req.params;
        if (!reference) {
            return sendError(res, 'Reference is required', 400);
        }
        const result = await verifyOrder(reference);
        return sendSuccess(res, result, 'Order verified successfully', 200);
    }
    catch (err) {
        if (err.message === 'Order not found') {
            return sendError(res, err.message, 404);
        }
        if (err.message === 'Payment was not successful') {
            return sendError(res, err.message, 400);
        }
        next(err);
    }
};
export const myOrders = async (req, res, next) => {
    try {
        const orders = await getMyOrders(req.user.userId);
        return sendSuccess(res, orders, 'Orders fetched successfully', 200);
    }
    catch (err) {
        next(err);
    }
};
export const myTickets = async (req, res, next) => {
    try {
        const tickets = await getMyTickets(req.user.userId);
        return sendSuccess(res, tickets, 'Tickets fetched successfully', 200);
    }
    catch (err) {
        next(err);
    }
};
export const scan = async (req, res, next) => {
    try {
        const { code } = req.params;
        if (!code) {
            return sendError(res, 'Ticket code is required', 400);
        }
        const ticket = await scanTicket(code, req.user.userId);
        return sendSuccess(res, ticket, 'Ticket scanned successfully', 200);
    }
    catch (err) {
        if (err.message === 'INVALID_TICKET' ||
            err.message === 'ALREADY_USED' ||
            err.message === 'TICKET_CANCELLED') {
            return sendError(res, err.message, 400);
        }
        next(err);
    }
};
export const webhook = async (req, res, next) => {
    try {
        await handleWebhook(req.body);
        return res.status(200).send('OK');
    }
    catch (err) {
        next(err);
    }
};
//# sourceMappingURL=orders.controller.js.map