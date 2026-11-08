import { emailConfig, getResend } from './config.js';
import { splitName } from './validate.js';
import { sendWelcomeEmail } from './send.js';

export type SubscribeResult =
  | { status: 'subscribed' } // brand-new contact
  | { status: 'resubscribed' } // existed but had unsubscribed; opted back in
  | { status: 'already_subscribed' };

/**
 * Adds an email to the marketing list (Resend Contacts + the list segment)
 * and sends the welcome email the first time someone joins.
 */
export async function subscribe(input: { email: string; name?: string }): Promise<SubscribeResult> {
  const resend = getResend();
  const { segmentId } = emailConfig();
  const names = input.name ? splitName(input.name) : {};

  const existing = await resend.contacts.get({ email: input.email });
  let result: SubscribeResult;

  if (existing.data) {
    const wasUnsubscribed = existing.data.unsubscribed;
    if (wasUnsubscribed || (names.firstName && !existing.data.first_name)) {
      const { error } = await resend.contacts.update({
        email: input.email,
        unsubscribed: false,
        ...(existing.data.first_name ? {} : names),
      });
      if (error) throw new Error(`Resend contacts.update failed: ${error.message}`);
    }
    if (segmentId) {
      // Ensures older contacts land in the list segment; harmless if already there.
      await resend.contacts.segments.add({ email: input.email, segmentId });
    }
    result = wasUnsubscribed ? { status: 'resubscribed' } : { status: 'already_subscribed' };
  } else if (existing.error && existing.error.name !== 'not_found') {
    throw new Error(`Resend contacts.get failed: ${existing.error.message}`);
  } else {
    const { error } = await resend.contacts.create({
      email: input.email,
      unsubscribed: false,
      ...names,
      ...(segmentId ? { segments: [{ id: segmentId }] } : {}),
    });
    if (error) throw new Error(`Resend contacts.create failed: ${error.message}`);
    result = { status: 'subscribed' };
  }

  if (result.status !== 'already_subscribed') {
    try {
      await sendWelcomeEmail({ to: input.email, firstName: names.firstName });
    } catch (err) {
      // The signup itself succeeded; don't fail the request over the welcome email.
      console.error('[email] welcome email failed', err);
    }
  }

  return result;
}
