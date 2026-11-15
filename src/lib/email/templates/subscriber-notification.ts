import { emailLayout } from './layout.js';
import { escapeHtml } from '../validate.js';

/** Internal heads-up sent when someone joins the email list via /api/subscribe. */
export function subscriberNotificationEmail(params: { email: string; name?: string; resubscribed: boolean }) {
  const heading = params.resubscribed ? 'Email list re-subscribe' : 'New email list signup';
  const subject = `${heading}: ${params.email}`.slice(0, 150);
  const row = (label: string, value: string) =>
    `<tr><td style="padding:4px 12px 4px 0;color:#6b675a;vertical-align:top;white-space:nowrap;">${label}</td><td style="padding:4px 0;">${value}</td></tr>`;

  const html = emailLayout({
    preheader: `${params.email} joined the email list on pelletsauna.com`,
    body: `
      <p style="margin:0 0 16px;font-weight:bold;">${heading}</p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:14px;margin-bottom:20px;">
        ${row('Email', `<a href="mailto:${escapeHtml(params.email)}" style="color:#c2734a;">${escapeHtml(params.email)}</a>`)}
        ${params.name ? row('Name', escapeHtml(params.name)) : ''}
      </table>
      <p style="margin:0;font-size:13px;color:#6b675a;">They have been sent the welcome email. Reply to this email to write to them directly.</p>`,
  });

  const text = [heading, `Email: ${params.email}`, ...(params.name ? [`Name: ${params.name}`] : [])].join('\n');

  return { subject, html, text };
}
