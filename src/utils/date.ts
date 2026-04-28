/**
 * Checks if an event has passed its end date and time.
 * @param endDate The end date of the event (as stored in DB)
 * @param endTime The end time of the event (string like "18:30" or "06:45 PM")
 * @returns boolean
 */
export const isEventExpired = (endDate: Date, endTime: string): boolean => {
    const now = new Date();
    
    // 1. Convert endDate (from DB) to a comparable Date object at the end of that day
    // The DB stores endDate as a DateTime, usually at midnight.
    const expirationDate = new Date(endDate);
    
    // 2. Parse endTime to set hours/minutes on the expirationDate
    // Standardizing on "HH:mm" format, but handling potential variations
    let hours = 0;
    let minutes = 0;
    
    if (endTime && endTime.includes(':')) {
        const parts = endTime.trim().split(':');
        hours = parseInt(parts[0] || '0');
        
        // Handle AM/PM if present
        if (endTime.toUpperCase().includes('PM') && hours < 12) {
            hours += 12;
        } else if (endTime.toUpperCase().includes('AM') && hours === 12) {
            hours = 0;
        }
        
        const minutesPart = parts[1] || '00';
        minutes = parseInt(minutesPart.substring(0, 2));
    }
    
    expirationDate.setHours(hours, minutes, 0, 0);
    
    return now > expirationDate;
};
