export declare const initializePayment: (data: {
    email: string;
    amount: number;
    reference: string;
    metadata?: Record<string, any>;
}) => Promise<any>;
export declare const verifyPayment: (reference: string) => Promise<any>;
export declare const verifyWebhookSignature: (payload: string, signature: string) => boolean;
//# sourceMappingURL=paystack.d.ts.map