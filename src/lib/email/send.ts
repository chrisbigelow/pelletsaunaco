import { emailConfig, getResend } from './config.js';
import { welcomeEmail } from './templates/welcome.js';
import { contactNotificationEmail } from './templates/contact-notification.js';

export async function sendWelcomeEmail(params: { to: string; firstName?: string }) {
  const { from, replyTo, siteUrl } = emailConfig();
  const { subject, html, text } = welcomeEmail({ firstName: params.firstName, siteUrl });
  const { error } = await getResend().emails.send({
    from,
    to: params.to,
    replyTo,
    subject,
    html,
    text,
    tags: [{ name: 'category', value: 'welcome' }],
  });
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
