import { emailLayout } from './layout.js';
import { escapeHtml } from '../validate.js';

export function welcomeEmail(params: { firstName?: string; siteUrl: string }) {
  const greeting = params.firstName ? `Hi ${escapeHtml(params.firstName)},` : 'Hi there,';
  const subject = "You're on the list — P1 Pellet Sauna Stove updates";

  const html = emailLayout({
    preheader: "Thanks for joining. We'll keep you posted as the P1 heads to production.",
    body: `
      <p style="margin:0 0 16px;">${greeting}</p>
      <p style="margin:0 0 16px;">Thanks for joining The Pellet Sauna Company email list. You'll be among the first to hear when <strong>P1 preorders open</strong>, plus build updates as we bring the stove to production in mid-2027.</p>
      <p style="margin:0 0 24px;">We'll only email when there's something worth sharing.</p>
      <p style="margin:0 0 24px;">
        <a href="${params.siteUrl}/#product" style="display:inline-block;background:#c2734a;color:#ffffff;text-decoration:none;font-size:12px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;padding:14px 22px;">Explore the P1</a>
      </p>
      <p style="margin:0;">Questions? Just reply to this email — it comes straight to us.</p>
      <p style="margin:16px 0 0;">— Jared &amp; the Pellet Sauna Co. team</p>`,
    footer: `<p style="margin:0 0 8px;">You're receiving this because you signed up at pelletsauna.com. Every update includes a one-click unsubscribe link.</p>`,
  });

  const text = [
    params.firstName ? `Hi ${params.firstName},` : 'Hi there,',
    '',
    "Thanks for joining The Pellet Sauna Company email list. You'll be among the first to hear when P1 preorders open, plus build updates as we bring the stove to production in mid-2027.",
    '',
    "We'll only email when there's something worth sharing.",
    '',
    `Explore the P1: ${params.siteUrl}/#product`,
    '',
    'Questions? Just reply to this email.',
    '',
    '— Jared & the Pellet Sauna Co. team',
  ].join('\n');

  return { subject, html, text };
}
