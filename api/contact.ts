import { subscribe } from '../src/lib/email/subscribers.js';
import { sendContactNotification } from '../src/lib/email/send.js';
import { cleanText, json, normalizeEmail, readBody } from '../src/lib/email/validate.js';

export async function POST(request: Request): Promise<Response> {
  const body = await readBody(request);

  if (body.botcheck) return json({ ok: true });

  const email = normalizeEmail(body.email);
  const name = cleanText(body.name, 100);
  const subject = cleanText(body.form_subject, 150);
  const message = cleanText(body.message, 5000);
  const joinList = body.newsletter === 'on' || body.newsletter === true || body.newsletter === 'true';

  if (!name || !email || !message) {
    return json({ ok: false, error: 'Please fill in your name, a valid email, and a message.' }, 400);
  }

  try {
    await sendContactNotification({ name, email, subject, message, joinedList: joinList });
  } catch (err) {
    console.error('[api/contact] notification failed', err);
    return json({ ok: false, error: 'Sorry, your message could not be sent. Please email us directly.' }, 500);
  }

  if (joinList) {
    try {
      await subscribe({ email, name });
    } catch (err) {
      // The message was delivered; list signup failing shouldn't surface as an error.
      console.error('[api/contact] list signup failed', err);
    }
  }

  return json({ ok: true });
}
