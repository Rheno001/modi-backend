import axios from 'axios';
import { env } from '../config/env.js';
const paystackClient = axios.create({
    baseURL: 'https://api.paystack.co',
    headers: {
        Authorization: `Bearer ${env.paystackSecretKey}`,
        'Content-Type': 'application/json',
    },
});
export const initializePayment = async (data) => {
    const response = await paystackClient.post('/transaction/initialize', {
        email: data.email,
        amount: Math.round(data.amount * 100), // Paystack expects kobo
        reference: data.reference,
        metadata: data.metadata,
        callback_url: `${env.clientUrl}/payment/verify`,
    });
    return response.data.data;
};
export const verifyPayment = async (reference) => {
    const response = await paystackClient.get(`/transaction/verify/${reference}`);
    return response.data.data;
};
export const verifyWebhookSignature = (payload, signature) => {
    const crypto = require('crypto');
    const hash = crypto
        .createHmac('sha512', env.paystackSecretKey)
        .update(payload)
        .digest('hex');
    return hash === signature;
};
//# sourceMappingURL=paystack.js.map