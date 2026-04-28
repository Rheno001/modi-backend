import type { Response, NextFunction } from 'express';
import type { AuthRequest } from '../../middlewares/auth.middleware.js';
import { validateCreateEvent, validateUpdateEvent } from './events.validation.js';
import {
    createEvent,
    getAllEvents,
    getEventById,
    getMyEvents,
    updateEvent,
    cancelEvent,
    publishEvent,
    adminGetAllEvents,
    cancelEvent as deleteEvent,
    getEventAttendees,
    getEventAnalytics,
} from './events.service.js';
import { sendSuccess, sendError } from '../../utils/response.js';

export const create = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const errors = validateCreateEvent(req.body);
        if (errors.length > 0) {
            return sendError(res, errors[0], 400);
        }

        const event = await createEvent(req.user!.userId, req.body);
        return sendSuccess(res, event, 'Event created successfully', 201);
    } catch (err) {
        next(err);
    }
};

export const getAll = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { city, category, search, page, limit } = req.query;

        const result = await getAllEvents({
            city: city as string,
            category: category as string,
            search: search as string,
            page: page ? parseInt(page as string) : 1,
            limit: limit ? parseInt(limit as string) : 12,
        });

        return sendSuccess(res, result, 'Events fetched successfully', 200);
    } catch (err) {
        next(err);
    }
};

export const getOne = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const event = await getEventById(req.params.id as string, req.user?.userId, req.user?.role);
        return sendSuccess(res, event, 'Event fetched successfully', 200);
    } catch (err: any) {
        if (err.message === 'Event not found') {
            return sendError(res, err.message, 404);
        }
        next(err);
    }
};

export const getMine = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const events = await getMyEvents(req.user!.userId);
        return sendSuccess(res, events, 'Your events fetched successfully', 200);
    } catch (err) {
        next(err);
    }
};

export const update = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const errors = validateUpdateEvent(req.body);
        if (errors.length > 0) {
            return sendError(res, errors[0], 400);
        }

        const event = await updateEvent(
            req.params.id as string,
            req.user!.userId,
            req.user!.role,
            req.body
        );
        return sendSuccess(res, event, 'Event updated successfully', 200);
    } catch (err: any) {
        if (
            err.message === 'Event not found' ||
            err.message === 'You are not authorized to edit this event' ||
            err.message.startsWith('Cannot edit a')
        ) {
            const status = err.message === 'Event not found' ? 404 : 403;
            return sendError(res, err.message, status);
        }
        next(err);
    }
};

export const cancel = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await cancelEvent(
            req.params.id as string,
            req.user!.userId,
            req.user!.role
        );
        const message = (result as any).deleted 
            ? 'Event deleted successfully' 
            : 'Event cancelled successfully';
        return sendSuccess(res, result, message, 200);
    } catch (err: any) {
        if (
            err.message === 'Event not found' ||
            err.message === 'You are not authorized to cancel this event' ||
            err.message === 'Event is already cancelled'
        ) {
            const status = err.message === 'Event not found' ? 404 : 403;
            return sendError(res, err.message, status);
        }
        next(err);
    }
};

export const remove = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await deleteEvent(
            req.params.id as string,
            req.user!.userId,
            req.user!.role
        );
        const message = (result as any).deleted 
            ? 'Event deleted successfully' 
            : 'Event cancelled successfully';
        return sendSuccess(res, result, message, 200);
    } catch (err: any) {
        if (
            err.message === 'Event not found' ||
            err.message === 'You are not authorized to cancel this event' ||
            err.message === 'Event is already cancelled'
        ) {
            const status = err.message === 'Event not found' ? 404 : 403;
            return sendError(res, err.message, status);
        }
        next(err);
    }
};

export const publish = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const event = await publishEvent(
            req.params.id as string,
            req.user!.userId,
            req.user!.role
        );
        return sendSuccess(res, event, 'Event published successfully', 200);
    } catch (err: any) {
        if (
            err.message === 'Event not found' ||
            err.message === 'You are not authorized to publish this event' ||
            err.message === 'Cannot publish a cancelled event' ||
            err.message === 'Event is already published' ||
            err.message === 'Cannot publish an event with no ticket types'
        ) {
            const status = err.message === 'Event not found' ? 404 : 400;
            return sendError(res, err.message, status);
        }
        next(err);
    }
};

export const getAttendees = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const attendees = await getEventAttendees(
            req.params.id as string,
            req.user!.userId,
            req.user!.role
        );
        return sendSuccess(res, attendees, 'Event attendees fetched successfully', 200);
    } catch (err: any) {
        if (
            err.message === 'Event not found' ||
            err.message === 'You are not authorized to view attendees for this event'
        ) {
            const status = err.message === 'Event not found' ? 404 : 403;
            return sendError(res, err.message, status);
        }
        next(err);
    }
};

export const getAnalytics = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const analytics = await getEventAnalytics(
            req.params.id as string,
            req.user!.userId,
            req.user!.role
        );
        return sendSuccess(res, analytics, 'Event analytics fetched successfully', 200);
    } catch (err: any) {
        if (
            err.message === 'Event not found' ||
            err.message === 'You are not authorized to view analytics for this event'
        ) {
            const status = err.message === 'Event not found' ? 404 : 403;
            return sendError(res, err.message, status);
        }
        next(err);
    }
};

export const adminGetAll = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const events = await adminGetAllEvents();
        return sendSuccess(res, events, 'All events fetched successfully', 200);
    } catch (err) {
        next(err);
    }
};