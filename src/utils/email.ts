import { Resend } from 'resend';
import { env } from '../config/env.js';

const resend = new Resend(env.resendApiKey);

const BRAND_COLOR = '#E11D2E';
const BRAND_COLOR_LIGHT = '#FEF2F2';

export const sendTicketConfirmationEmail = async (data: {
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
}) => {
  if (!env.resendApiKey) {
    console.log('[Email] No Resend API key — skipping email');
    return;
  }

  const ticketsHtml = data.tickets
    .map(
      (ticket, index) => `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f9f9f9;border:1px solid #e5e5e5;border-radius:12px;margin-bottom:16px;">
          <tr>
            <td align="center" style="padding:20px;">
              <p style="color:#888;font-size:11px;margin:0 0 4px 0;text-transform:uppercase;letter-spacing:0.5px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">Ticket ${index + 1}</p>
              <p style="color:#111;font-size:15px;font-weight:700;margin:0 0 16px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">${ticket.ticketTypeName}</p>
              ${ticket.qrUrl
          ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;border:1px solid #e5e5e5;border-radius:10px;">
                          <tr>
                            <td style="padding:10px;">
                              <img src="${ticket.qrUrl}" alt="QR Code" width="160" height="160" style="width:160px;height:160px;display:block;" />
                            </td>
                          </tr>
                        </table>`
          : ''
        }
              <p style="color:#666;font-size:12px;font-family:'Courier New',Courier,monospace;margin:12px 0 0 0;letter-spacing:1px;">${ticket.uniqueCode}</p>
              <p style="color:#aaa;font-size:11px;margin:4px 0 0 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">Show this QR code at the entrance</p>
            </td>
          </tr>
        </table>
    `,
    )
    .join('');

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <title>Your Tickets for ${data.eventTitle}</title>
        <!--[if mso]>
        <noscript>
          <xml>
            <o:OfficeDocumentSettings>
              <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
          </xml>
        </noscript>
        <![endif]-->
      </head>
      <body style="background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;margin:0;padding:0;">
        <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">
          Your ticket${data.tickets.length > 1 ? 's' : ''} for ${data.eventTitle} ${data.tickets.length > 1 ? 'are' : 'is'} confirmed.
        </div>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f4f5;">
          <tr>
            <td align="center" style="padding:32px 16px;">
              <table role="presentation" width="540" cellpadding="0" cellspacing="0" border="0" style="width:540px;max-width:540px;">

                <!-- Header -->
                <tr>
                  <td align="center" style="padding-bottom:24px;">
                    <h1 style="color:${BRAND_COLOR};font-size:26px;font-weight:900;margin:0;letter-spacing:-0.5px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">MODI</h1>
                    <p style="color:#888;font-size:13px;margin:4px 0 0 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">Your ticket confirmation</p>
                  </td>
                </tr>

                <!-- Main Card -->
                <tr>
                  <td style="background:#ffffff;border:1px solid #e5e5e5;border-radius:20px;padding:32px;">

                    <p style="color:#888;font-size:13px;margin:0 0 4px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">You have registered for</p>
                    <h2 style="color:#111;font-size:22px;font-weight:800;margin:0 0 24px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">${data.eventTitle}</h2>

                    <div style="border-top:1px solid #f0f0f0;line-height:1px;font-size:1px;margin-bottom:20px;">&nbsp;</div>

                    <!-- Date Row -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px;">
                      <tr>
                        <td width="52" valign="top">
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="42" style="background:${BRAND_COLOR_LIGHT};border:1px solid #f3c9cc;border-radius:8px;">
                            <tr>
                              <td align="center" style="padding:6px 4px 2px;">
                                <p style="color:${BRAND_COLOR};font-size:10px;font-weight:700;text-transform:uppercase;margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">${new Date(data.eventDate).toLocaleString('en', { month: 'short' })}</p>
                              </td>
                            </tr>
                            <tr>
                              <td align="center" style="padding:0 4px 6px;">
                                <p style="color:#111;font-size:18px;font-weight:800;margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">${new Date(data.eventDate).getDate()}</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                        <td valign="top" style="padding-left:14px;">
                          <p style="color:#111;font-size:15px;font-weight:700;margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
                            ${new Date(data.eventDate).toLocaleDateString('en-NG', { weekday: 'long', month: 'long', day: 'numeric' })}
                          </p>
                          <p style="color:#888;font-size:13px;margin:2px 0 0 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">${data.eventTime}</p>
                        </td>
                      </tr>
                    </table>

                    <!-- Venue Row -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
                      <tr>
                        <td width="52" valign="top">
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="42" height="42" style="background:${BRAND_COLOR_LIGHT};border:1px solid #f3c9cc;border-radius:8px;">
                            <tr>
                              <td align="center" valign="middle" style="font-size:18px; height:42px;">📍</td>
                            </tr>
                          </table>
                        </td>
                        <td valign="top" style="padding-left:14px;">
                          <p style="color:#111;font-size:15px;font-weight:700;margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">${data.eventVenue}</p>
                          <p style="color:#888;font-size:13px;margin:2px 0 0 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">${data.eventCity}</p>
                        </td>
                      </tr>
                    </table>

                    <div style="border-top:1px solid #f0f0f0;line-height:1px;font-size:1px;margin-bottom:24px;">&nbsp;</div>

                    <!-- Tickets -->
                    <h3 style="color:#111;font-size:15px;font-weight:700;margin:0 0 16px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
                      Your Ticket${data.tickets.length > 1 ? 's' : ''}
                    </h3>
                    ${ticketsHtml}

                    <!-- CTA -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:8px;">
                      <tr>
                        <td align="center" style="border-radius:10px;background:${BRAND_COLOR};">
                          <a href="#" target="_blank" style="display:block;padding:14px 20px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:10px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
                            View My Tickets
                          </a>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td align="center" style="padding-top:20px;">
                    <p style="color:#bbb;font-size:11px;margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
                      Sent by Modi · If you didn't make this purchase, please contact support.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
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
  } catch (err) {
    console.error('[Email] Failed to send ticket confirmation:', err);
  }
};