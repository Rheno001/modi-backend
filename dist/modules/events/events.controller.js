import { validateCreateEvent, validateUpdateEvent } from './events.validation.js';
import { createEvent, getAllEvents, getEventById, getMyEvents, updateEvent, cancelEvent, publishEvent, adminGetAllEvents, } from './events.service.js';
import { sendSuccess, sendError } from '../../utils/response.js';
export const create = async (req, res, next) => {
    try {
        const errors = validateCreateEvent(req.body);
        if (errors.length > 0) {
            return sendError(res, errors[0], 400);
        }
        const event = await createEvent(req.user.userId, req.body);
        return sendSuccess(res, event, 'Event created successfully', 201);
    }
    catch (err) {
        next(err);
    }
};
export const getAll = async (req, res, next) => {
    try {
        const { city, category, search, page, limit } = req.query;
        const result = await getAllEvents({
            city: city,
            category: category,
            search: search,
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 12,
        });
        return sendSuccess(res, result, 'Events fetched successfully', 200);
    }
    catch (err) {
        next(err);
    }
};
export const getOne = async (req, res, next) => {
    try {
        const event = await getEventById(req.params.id);
        return sendSuccess(res, event, 'Event fetched successfully', 200);
    }
    catch (err) {
        if (err.message === 'Event not found') {
            return sendError(res, err.message, 404);
        }
        next(err);
    }
};
export const getMine = async (req, res, next) => {
    try {
        const events = await getMyEvents(req.user.userId);
        return sendSuccess(res, events, 'Your events fetched successfully', 200);
    }
    catch (err) {
        next(err);
    }
};
export const update = async (req, res, next) => {
    try {
        const errors = validateUpdateEvent(req.body);
        if (errors.length > 0) {
            return sendError(res, errors[0], 400);
        }
        const event = await updateEvent(req.params.id, req.user.userId, req.user.role, req.body);
        return sendSuccess(res, event, 'Event updated successfully', 200);
    }
    catch (err) {
        if (err.message === 'Event not found' ||
            err.message === 'You are not authorized to edit this event' ||
            err.message === 'Cannot edit a cancelled event') {
            const status = err.message === 'Event not found' ? 404 : 403;
            return sendError(res, err.message, status);
        }
        next(err);
    }
};
export const cancel = async (req, res, next) => {
    try {
        const event = await cancelEvent(req.params.id, req.user.userId, req.user.role);
        return sendSuccess(res, event, 'Event cancelled successfully', 200);
    }
    catch (err) {
        if (err.message === 'Event not found' ||
            err.message === 'You are not authorized to cancel this event' ||
            err.message === 'Event is already cancelled') {
            const status = err.message === 'Event not found' ? 404 : 403;
            return sendError(res, err.message, status);
        }
        next(err);
    }
};
export const publish = async (req, res, next) => {
    try {
        const event = await publishEvent(req.params.id, req.user.userId, req.user.role);
        return sendSuccess(res, event, 'Event published successfully', 200);
    }
    catch (err) {
        if (err.message === 'Event not found' ||
            err.message === 'You are not authorized to publish this event' ||
            err.message === 'Cannot publish a cancelled event' ||
            err.message === 'Event is already published' ||
            err.message === 'Cannot publish an event with no ticket types') {
            const status = err.message === 'Event not found' ? 404 : 400;
            return sendError(res, err.message, status);
        }
        next(err);
    }
};
export const adminGetAll = async (req, res, next) => {
    try {
        const events = await adminGetAllEvents();
        return sendSuccess(res, events, 'All events fetched successfully', 200);
    }
    catch (err) {
        next(err);
    }
};
//# sourceMappingURL=events.controller.js.map