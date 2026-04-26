import crypto from 'crypto';
import QRCode from 'qrcode';
export const generateUniqueCode = () => {
    return crypto.randomBytes(8).toString('hex').toUpperCase();
};
export const generateQRCode = async (code) => {
    const qrDataUrl = await QRCode.toDataURL(code, {
        width: 300,
        margin: 2,
        color: {
            dark: '#000000',
            light: '#FFFFFF',
        },
    });
    return qrDataUrl;
};
//# sourceMappingURL=ticket.js.map