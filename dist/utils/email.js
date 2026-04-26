import { Resend } from 'resend';
import { env } from '../config/env.js';
const resend = new Resend(env.resendApiKey);
export const sendTicketConfirmationEmail = async (data) => {
    if (!env.resendApiKey) {
        console.log('[Email] No Resend API key — skipping email');
        return;
    }
    const ticketsHtml = data.tickets
        .map((ticket, index) => `
        <div style="background:#f9f9f9;border:1px solid #e5e5e5;border-radius:12px;padding:20px;margin-bottom:16px;text-align:center;">
          <p style="color:#888;font-size:11px;margin:0 0 4px 0;text-transform:uppercase;letter-spacing:0.5px;">Ticket ${index + 1}</p>
          <p style="color:#111;font-size:15px;font-weight:700;margin:0 0 16px 0;">${ticket.ticketTypeName}</p>
          ${ticket.qrUrl
        ? `<div style="display:inline-block;background:white;padding:10px;border-radius:10px;border:1px solid #e5e5e5;">
                      <img src="${ticket.qrUrl}" alt="QR Code" style="width:160px;height:160px;display:block;" />
                    </div>`
        : ''}
          <p style="color:#666;font-size:12px;font-family:monospace;margin:12px 0 0 0;">${ticket.uniqueCode}</p>
          <p style="color:#aaa;font-size:11px;margin:4px 0 0 0;">Show this QR code at the entrance</p>
        </div>
    `)
        .join('');
    const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Your Tickets for ${data.eventTitle}</title>
      </head>
      <body style="background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;margin:0;padding:32px 16px;">
        <div style="max-width:540px;margin:0 auto;">

          <!-- Header -->
          <div style="text-align:center;margin-bottom:24px;">
            <h1 style="color:#111;font-size:26px;font-weight:900;margin:0;letter-spacing:-0.5px;">MODI</h1>
            <p style="color:#888;font-size:13px;margin:4px 0 0 0;">Your ticket confirmation</p>
          </div>

          <!-- Main Card -->
          <div style="background:white;border:1px solid #e5e5e5;border-radius:20px;padding:32px;margin-bottom:20px;">

            <p style="color:#888;font-size:13px;margin:0 0 4px 0;">You have registered for</p>
            <h2 style="color:#111;font-size:22px;font-weight:800;margin:0 0 24px 0;">${data.eventTitle}</h2>

            <hr style="border:none;border-top:1px solid #f0f0f0;margin:0 0 20px 0;" />

            <!-- Date Row -->
            <div style="display:flex;align-items:flex-start;gap:14px;margin-bottom:16px;">
              <div style="background:#f4f4f5;border:1px solid #e5e5e5;border-radius:8px;padding:6px 10px;text-align:center;min-width:42px;flex-shrink:0;">
                <p style="color:#888;font-size:10px;font-weight:700;text-transform:uppercase;margin:0;">${new Date(data.eventDate).toLocaleString('en', { month: 'short' })}</p>
                <p style="color:#111;font-size:18px;font-weight:800;margin:0;">${new Date(data.eventDate).getDate()}</p>
              </div>
              <div>
                <p style="color:#111;font-size:15px;font-weight:700;margin:0;">
                  ${new Date(data.eventDate).toLocaleDateString('en-NG', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
                <p style="color:#888;font-size:13px;margin:2px 0 0 0;">${data.eventTime}</p>
              </div>
            </div>

            <!-- Venue Row -->
            <div style="display:flex;align-items:flex-start;gap:14px;margin-bottom:24px;">
              <div style="background:#f4f4f5;border:1px solid #e5e5e5;border-radius:8px;padding:8px 10px;min-width:42px;flex-shrink:0;text-align:center;">
                <img src="https://cdn.jsdelivr.net/npm/heroicons@1.0.6/solid/location-marker.svg" width="18" height="18" style="display:block;margin:0 auto;opacity:0.5;" alt="Location" />
              </div>
              <div>
                <p style="color:#111;font-size:15px;font-weight:700;margin:0;">${data.eventVenue}</p>
                <p style="color:#888;font-size:13px;margin:2px 0 0 0;">${data.eventCity}</p>
              </div>
            </div>

            <hr style="border:none;border-top:1px solid #f0f0f0;margin:0 0 24px 0;" />

            <!-- Tickets -->
            <h3 style="color:#111;font-size:15px;font-weight:700;margin:0 0 16px 0;">
              Your Ticket${data.tickets.length > 1 ? 's' : ''}
            </h3>
            ${ticketsHtml}

          </div>

          <!-- Footer -->
          <p style="color:#bbb;font-size:11px;text-align:center;margin:0;">
            Sent by Modi · If you didn't make this purchase, please contact support.
          </p>
        </div>
      </body>
    </html>
  `;
    try {
        await resend.emails.send({
            from: env.fromEmail,
            to: data.to,
            subject: `Your tickets for ${data.eventTitle} 🎟️`,
            html,
        });
        console.log(`[Email] Ticket confirmation sent to ${data.to}`);
    }
    catch (err) {
        // Never let email failure break the payment flow
        console.error('[Email] Failed to send ticket confirmation:', err);
    }
};
//# sourceMappingURL=email.js.map