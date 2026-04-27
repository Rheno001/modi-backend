import { Resend } from 'resend';
import { env } from '../config/env.js';

const resend = new Resend(env.resendApiKey);

const getEmailLayout = (content: string, previewText: string) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${previewText}</title>
  </head>
  <body style="background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;margin:0;padding:40px 16px;">
    <div style="max-width:540px;margin:0 auto;">
      <!-- Header -->
      <div style="text-align:center;margin-bottom:32px;">
         <h1 style="color:#ffffff;font-size:28px;font-weight:900;margin:0;letter-spacing:-1px;">MODI<span style="color:#e11d48;">.</span></h1>
         <p style="color:#666;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;margin:4px 0 0 0;">Events Redefined</p>
      </div>

      <!-- Main Content -->
      <div style="background:#111111;border:1px solid #222222;border-radius:24px;padding:32px;color:#ffffff;">
        ${content}
      </div>

      <!-- Footer -->
      <div style="margin-top:32px;text-align:center;">
        <p style="color:#444;font-size:12px;margin:0;">
          &copy; ${new Date().getFullYear()} Modi Events. All rights reserved.
        </p>
        <p style="color:#444;font-size:11px;margin:8px 0 0 0;">
          If you didn't request this email, please ignore it or contact support.
        </p>
      </div>
    </div>
  </body>
</html>
`;

export const sendWelcomeEmail = async (data: { to: string; firstName: string }) => {
    if (!env.resendApiKey) {
        console.log('[Email] No Resend API key — skipping welcome email');
        return;
    }

    const content = `
    <h2 style="font-size:24px;font-weight:800;margin:0 0 16px 0;color:#ffffff;">Welcome to the family, ${data.firstName}!</h2>
    <p style="color:#a1a1aa;font-size:15px;line-height:1.6;margin:0 0 24px 0;">
      We're absolutely thrilled to have you here. Modi is your ultimate companion for discovering and experiencing the best events around you.
    </p>
    
    <div style="background:#1a1a1a;border-radius:16px;padding:20px;margin-bottom:24px;border:1px solid #222;">
      <h3 style="font-size:16px;font-weight:700;margin:0 0 12px 0;color:#ffffff;">What can you do with Modi?</h3>
      <ul style="color:#a1a1aa;font-size:14px;margin:0;padding:0 0 0 20px;line-height:1.6;">
        <li style="margin-bottom:8px;">Discover concerts, comedy shows, and local festivals.</li>
        <li style="margin-bottom:8px;">Securely book tickets with our seamless checkout.</li>
        <li style="margin-bottom:8px;">Keep all your tickets digitally in one secure place.</li>
      </ul>
    </div>

    <p style="color:#a1a1aa;font-size:15px;line-height:1.6;margin:0 0 32px 0;">
      Ready to find your next great experience? Head over to your dashboard and see what's trending.
    </p>

    <a href="${env.clientUrl}" style="display:inline-block;background:#e11d48;color:white;padding:14px 28px;border-radius:12px;font-weight:700;text-decoration:none;font-size:15px;text-align:center;">
      Explore Events
    </a>
  `;

    const html = getEmailLayout(content, 'Welcome to Modi Events');

    try {
        const { data: resendData, error: resendError } = await resend.emails.send({
            from: env.fromEmail,
            to: data.to,
            subject: 'Welcome to Modi Events! 🚀',
            html,
        });

        if (resendError) {
            console.error('[Email] Resend error (Welcome):', JSON.stringify(resendError, null, 2));
            return;
        }

        console.log(`[Email] Welcome email sent successfully: ${resendData?.id}`);
    } catch (err) {
        console.error('[Email] Unexpected failure (Welcome):', err);
    }
};

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
        <div style="background:#1a1a1a;border:1px solid #222;border-radius:16px;padding:20px;margin-bottom:16px;text-align:center;">
          <p style="color:#555;font-size:11px;margin:0 0 4px 0;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Ticket ${index + 1}</p>
          <p style="color:#fff;font-size:16px;font-weight:700;margin:0 0 16px 0;">${ticket.ticketTypeName}</p>
          ${
              ticket.qrUrl
                  ? `<div style="display:inline-block;background:white;padding:12px;border-radius:12px;">
                      <img src="${ticket.qrUrl}" alt="QR Code" style="width:160px;height:160px;display:block;" />
                    </div>`
                  : ''
          }
          <p style="color:#888;font-size:12px;font-family:monospace;margin:12px 0 0 0;">${ticket.uniqueCode}</p>
        </div>
    `,
        )
        .join('');

    const content = `
    <p style="color:#a1a1aa;font-size:13px;margin:0 0 4px 0;">You have registered for</p>
    <h2 style="color:#ffffff;font-size:24px;font-weight:800;margin:0 0 24px 0;">${data.eventTitle}</h2>

    <div style="background:#1a1a1a;border-radius:16px;padding:24px;margin-bottom:24px;border:1px solid #222;">
      <!-- Date Row -->
      <div style="display:flex;align-items:center;margin-bottom:16px;">
        <div style="margin-right:16px;">
           <p style="color:#fff;font-size:15px;font-weight:700;margin:0;">
             ${new Date(data.eventDate).toLocaleDateString('en-NG', { weekday: 'long', month: 'long', day: 'numeric' })}
           </p>
           <p style="color:#666;font-size:13px;margin:2px 0 0 0;">${data.eventTime}</p>
        </div>
      </div>

      <!-- Venue Row -->
      <div style="margin-top:16px;border-top:1px solid #222;padding-top:16px;">
        <p style="color:#fff;font-size:15px;font-weight:700;margin:0;">${data.eventVenue}</p>
        <p style="color:#666;font-size:13px;margin:2px 0 0 0;">${data.eventCity}</p>
      </div>
    </div>

    <h3 style="color:#ffffff;font-size:16px;font-weight:700;margin:0 0 16px 0;">
      Your Ticket${data.tickets.length > 1 ? 's' : ''}
    </h3>
    ${ticketsHtml}
  `;

    const html = getEmailLayout(content, `Your tickets for ${data.eventTitle}`);

    try {
        const { data: resendData, error: resendError } = await resend.emails.send({
            from: env.fromEmail,
            to: data.to,
            subject: `Your tickets for ${data.eventTitle} 🎟️`,
            html,
        });

        if (resendError) {
            console.error('[Email] Resend error (Confirmation):', JSON.stringify(resendError, null, 2));
            return;
        }

        console.log(`[Email] Ticket confirmation sent successfully: ${resendData?.id}`);
    } catch (err) {
        console.error('[Email] Unexpected failure (Confirmation):', err);
    }
};