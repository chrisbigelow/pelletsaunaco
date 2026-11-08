import { emailLayout } from './layout.js';
import { escapeHtml } from '../validate.js';

export function contactNotificationEmail(params: {
  name: string;
  email: string;
  subject?: string;
  message: string;
  joinedList: boolean;
}) {
  const subject = `Website contact: ${params.subject || params.name}`.slice(0, 150);
  const row = (label: string, value: string) =>
    `<tr><td style="padding:4px 12px 4px 0;color:#6b675a;vertical-align:top;white-space:nowrap;">${label}</td><td style="padding:4px 0;">${value}</td></tr>`;

  const html = emailLayout({
    preheader: `${params.name} sent a message through pelletsauna.com`,
    body: `
      <p style="margin:0 0 16px;font-weight:bold;">New contact form submission</p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:14px;margin-bottom:20px;">
        ${row('Name', escapeHtml(params.name))}
        ${row('Email', `<a href="mailto:${escapeHtml(params.email)}" style="color:#c2734a;">${escapeHtml(params.email)}</a>`)}
        ${params.subject ? row('Subject', escapeHtml(params.subject)) : ''}
        ${row('Email list', params.joinedList ? 'Opted in' : 'Not opted in')}
      </table>
      <div style="padding:16px;background:#f6f1e7;border-left:3px solid #c2734a;white-space:pre-wrap;">${escapeHtml(params.message)}</div>
      <p style="margin:20px 0 0;font-size:13px;color:#6b675a;">Reply to this email to respond directly to ${escapeHtml(params.name)}.</p>`,
  });

  const text = [
    'New contact form submission',
    `Name: ${params.name}`,
    `Email: ${params.email}`,
    ...(params.subject ? [`Subject: ${params.subject}`] : []),
    `Email list: ${params.joinedList ? 'Opted in' : 'Not opted in'}`,
    '',
    params.message,
  ].join('\n');

  return { subject, html, text };
}
