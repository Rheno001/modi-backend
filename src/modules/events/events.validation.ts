export const validateCreateEvent = (data: any) => {
    const errors: string[] = [];

    if (!data.title || data.title.trim() === '') {
        errors.push('Event title is required');
    }

    if (!data.description || data.description.trim() === '') {
        errors.push('Event description is required');
    }

    if (!data.category || data.category.trim() === '') {
        errors.push('Event category is required');
    }

    if (!data.venue || data.venue.trim() === '') {
        errors.push('Venue is required');
    }

    if (!data.address || data.address.trim() === '') {
        errors.push('Address is required')
    }

    if (!data.city || data.city.trim() === '') {
        errors.push('City is required')
    }

    if (!data.state || data.state.trim() === '') {
        errors.push('State is required')
    }

    if (!data.startDate || data.startDate.trim() === '') {
        errors.push('Start date is required')
    }

    if (!data.endDate) {
        errors.push('End date is required');
    }

    if (data.startDate && data.endDate) {
        const start = new Date(data.startDate);
        const end = new Date(data.endDate);
        if (end < start) {
            errors.push('End date cannot be before start date');
        }
    }

    if (!data.startTime || data.startTime.trim() === '') {
        errors.push('Start time is required');
    }

    if (!data.endTime || data.endTime.trim() === '') {
        errors.push('End time is required');
    }

    if (!data.ticketTypes || !Array.isArray(data.ticketTypes) || data.ticketTypes.length === 0) {
        errors.push('At least one ticket type is required');
    } else {
        data.ticketTypes.forEach((ticket: any, index: number) => {
            if (!ticket.name || ticket.name.trim() === '') {
                errors.push(`Ticket type ${index + 1}: name is required`);
            }
            if (ticket.price === undefined || ticket.price === null) {
                errors.push(`Ticket type ${index + 1}: price is required`);
            } else if (typeof ticket.price !== 'number' || ticket.price < 0) {
                errors.push(`Ticket type ${index + 1}: price must be a positive number`);
            }
            if (!ticket.quantity) {
                errors.push(`Ticket type ${index + 1}: quantity is required`);
            } else if (typeof ticket.quantity !== 'number' || ticket.quantity < 1) {
                errors.push(`Ticket type ${index + 1}: quantity must be at least 1`);
            }
        });
    }


    return errors;
};


export const validateUpdateEvent = (data: any) => {
    const errors: string[] = [];

    if (data.startDate && data.endDate) {
        const start = new Date(data.startDate);
        const end = new Date(data.endDate);
        if (end < start) {
            errors.push('End date cannot be before start date');
        }
    }

    if (data.ticketTypes && Array.isArray(data.ticketTypes)) {
        data.ticketTypes.forEach((ticket: any, index: number) => {
            if (ticket.price !== undefined && (typeof ticket.price !== 'number' || ticket.price < 0)) {
                errors.push(`Ticket type ${index + 1}: price must be a positive number`);
            }
            if (ticket.quantity !== undefined && (typeof ticket.quantity !== 'number' || ticket.quantity < 1)) {
                errors.push(`Ticket type ${index + 1}: quantity must be at least 1`);
            }
        });
    }

    return errors;
};