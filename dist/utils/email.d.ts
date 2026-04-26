export declare const sendTicketConfirmationEmail: (data: {
    to: string;
    firstName: string;
    eventTitle: string;
    eventDate: string;
    eventTime: string;
    eventVenue: string;
    eventCity: string;
    tickets: {
        uniqueCode: string;
        qrUrl: string | null;
        ticketTypeName: string;
    }[];
}) => Promise<void>;
//# sourceMappingURL=email.d.ts.map