import { emailConfig, getResend } from './config.js';
import { welcomeEmail } from './templates/welcome.js';
import { contactNotificationEmail } from './templates/contact-notification.js';

/**
 * Sends the welcome email from the Resend template (editable in the Resend
 * dashboard). If that template is missing or unpublished, falls back to the
 * built-in copy so new subscribers always get a welcome.
 */
export async function sendWelcomeEmail(params: { to: string; firstName?: string }) {
  const { from, replyTo, siteUrl, welcomeTemplateId } = emailConfig();
  const resend = getResend();
  const tags = [{ name: 'category', value: 'welcome' }];

  if (welcomeTemplateId) {
    const { error } = await resend.emails.send({
      from,
      to: params.to,
      replyTo,
      template: { id: welcomeTemplateId, variables: { NAME: params.firstName || 'there' } },
      tags,
    });
    if (!error) return;
    console.warn(`[email] welcome template "${welcomeTemplateId}" failed, using built-in copy: ${error.message}`);
  }

  const { subject, html, text } = welcomeEmail({ firstName: params.firstName, siteUrl });
  const { error } = await resend.emails.send({ from, to: params.to, replyTo, subject, html, text, tags });
  if (error) throw new Error(`Resend emails.send (welcome) failed: ${error.message}`);
}

export async function sendContactNotification(params: {
  name: string;
  email: string;
  subject?: string;
  message: string;
  joinedList: boolean;
}) {
  const { from, contactInbox } = emailConfig();
  const { subject, html, text } = contactNotificationEmail(params);
  const { error } = await getResend().emails.send({
    from,
    to: contactInbox,
    replyTo: params.email, // hitting "Reply" answers the customer directly
    subject,
    html,
    text,
    tags: [{ name: 'category', value: 'contact_form' }],
  });
  if (error) throw new Error(`Resend emails.send (contact) failed: ${error.message}`);
}
