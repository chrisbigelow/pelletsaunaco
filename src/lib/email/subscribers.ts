import { emailConfig, getResend } from './config.js';
import { splitName } from './validate.js';
import { sendWelcomeEmail } from './send.js';

export type SubscribeResult =
  | { status: 'subscribed' } // brand-new contact
  | { status: 'resubscribed' } // existed but had unsubscribed; opted back in
  | { status: 'already_subscribed' };

/** Which form the contact first joined the list through. */
export type SubscribeSource = 'signup_form' | 'contact_form';

// Resend documents no length limit for property values; keep them short enough
// to read in the Audience tab. The full message is in the notification email.
const LAST_MESSAGE_MAX = 1000;

type Properties = Record<string, string>;

/**
 * Adds an email to the marketing list (Resend Contacts + the list segment)
 * and sends the welcome email the first time someone joins.
 *
 * `source` and `lastMessage` are saved as the contact properties `source` and
 * `contact_form_message`, which must exist in Resend (Audience → Properties).
 */
export async function subscribe(input: {
  email: string;
  name?: string;
  source: SubscribeSource;
  lastMessage?: string;
}): Promise<SubscribeResult> {
  const resend = getResend();
  const { segmentId } = emailConfig();
  const names = input.name ? splitName(input.name) : {};
  const lastMessage = input.lastMessage?.slice(0, LAST_MESSAGE_MAX);

  const existing = await resend.contacts.get({ email: input.email });
  let result: SubscribeResult;

  if (existing.data) {
    const wasUnsubscribed = existing.data.unsubscribed;
    const properties: Properties = {
      // First source wins: only filled in for contacts that don't have one yet.
      ...(hasProperty(existing.data.properties, 'source') ? {} : { source: input.source }),
      ...(lastMessage ? { contact_form_message: lastMessage } : {}),
    };
    const fields = {
      ...(wasUnsubscribed ? { unsubscribed: false } : {}),
      ...(existing.data.first_name ? {} : names),
    };
    const hasProperties = Object.keys(properties).length > 0;
    const hasFields = Object.keys(fields).length > 0;

    if (hasFields || hasProperties) {
      let { error } = await resend.contacts.update({
        email: input.email,
        ...fields,
        ...(hasProperties ? { properties } : {}),
      });
      if (error && hasProperties) {
        // A property problem (e.g. not created in this Resend account) must not block the signup.
        console.error('[email] contact properties rejected, retrying without them', error.message);
        error = hasFields ? (await resend.contacts.update({ email: input.email, ...fields })).error : null;
      }
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
    const contact = {
      email: input.email,
      unsubscribed: false,
      ...names,
      ...(segmentId ? { segments: [{ id: segmentId }] } : {}),
    };
    const properties: Properties = {
      source: input.source,
      ...(lastMessage ? { contact_form_message: lastMessage } : {}),
    };
    let { error } = await resend.contacts.create({ ...contact, properties });
    if (error) {
      console.error('[email] contact properties rejected, retrying without them', error.message);
      ({ error } = await resend.contacts.create(contact));
    }
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

/** True when the contact already has a non-empty value for the property. */
function hasProperty(properties: Record<string, unknown> | null | undefined, key: string): boolean {
  const entry = properties?.[key];
  const value = entry && typeof entry === 'object' && 'value' in entry ? entry.value : entry;
  return value !== undefined && value !== null && value !== '';
}
