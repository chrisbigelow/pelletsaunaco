import { emailConfig, getResend } from './config.js';
import { contactNotificationEmail } from './templates/contact-notification.js';

/**
 * Sends the welcome email. Its content lives only in Resend: Templates →
 * "Welcome — new email list signup" (alias welcome-email). Edit it there.
 */
export async function sendWelcomeEmail(params: { to: string; firstName?: string }) {
  const { from, replyTo, welcomeTemplateId } = emailConfig();
  const { error } = await getResend().emails.send({
    from,
    to: params.to,
    replyTo,
    template: { id: welcomeTemplateId, variables: { NAME: params.firstName || 'there' } },
    tags: [{ name: 'category', value: 'welcome' }],
  });
  if (error) throw new Error(`Resend welcome template "${welcomeTemplateId}" failed: ${error.message}`);
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
