import axios from 'axios';
import { env } from '../config/env.js';

const paystackClient = axios.create({
  baseURL: 'https://api.paystack.co',
  headers: {
    Authorization: `Bearer ${env.paystackSecretKey}`,
    'Content-Type': 'application/json',
  },
});

export const initializePayment = async (data: {
  email: string;
  amount: number;
  reference: string;
  origin?: string | undefined;
  metadata?: Record<string, any>;
}) => {
  const baseUrl = data.origin || env.clientUrl;
  console.log('[Paystack] Initializing with origin:', data.origin);
  console.log('[Paystack] Using baseUrl:', baseUrl);
  const response = await paystackClient.post('/transaction/initialize', {
    email: data.email,
    amount: Math.round(data.amount * 100), // Paystack expects kobo
    reference: data.reference,
    metadata: data.metadata,
    callback_url: `${baseUrl}/payment/verify`,
  });
  return response.data.data;
};

export const verifyPayment = async (reference: string) => {
  const response = await paystackClient.get(`/transaction/verify/${reference}`);
  return response.data.data;
};

export const verifyWebhookSignature = (payload: string, signature: string): boolean => {
  const crypto = require('crypto');
  const hash = crypto
    .createHmac('sha512', env.paystackSecretKey)
    .update(payload)
    .digest('hex');
  return hash === signature;
};