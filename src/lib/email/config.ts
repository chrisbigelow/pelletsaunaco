import { Resend } from 'resend';

/**
 * Server-only email configuration, used by the Vercel Functions in /api.
 * Values come from the Vercel project's environment variables at runtime.
 */
function env(name: string): string | undefined {
  return process.env[name] || undefined;
}

function required(name: string): string {
  const value = env(name);
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

let client: Resend | null = null;

export function getResend(): Resend {
  client ??= new Resend(required('RESEND_API_KEY'));
  return client;
}

export function emailConfig() {
  return {
    from: env('EMAIL_FROM') ?? 'The Pellet Sauna Co. <hello@pelletsauna.com>',
    replyTo: env('EMAIL_REPLY_TO') ?? 'jared@pelletsauna.com',
    // Comma-separated list; every address receives each contact-form message.
    contactInbox: (env('CONTACT_INBOX') ?? 'jared@pelletsauna.com')
      .split(',')
      .map((address) => address.trim())
      .filter(Boolean),
    segmentId: env('RESEND_SEGMENT_ID'),
    // Resend template (ID or alias) for the welcome email.
    welcomeTemplateId: env('RESEND_WELCOME_TEMPLATE') ?? 'welcome-email',
    siteUrl: 'https://www.pelletsauna.com',
  };
}
