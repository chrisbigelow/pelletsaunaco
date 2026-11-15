import { BOT_BLOCKED_MESSAGE, isBot } from '../src/lib/email/bot.js';
import { sendSubscriberNotification } from '../src/lib/email/send.js';
import { subscribe } from '../src/lib/email/subscribers.js';
import { cleanText, json, normalizeEmail, readBody } from '../src/lib/email/validate.js';

export async function POST(request: Request): Promise<Response> {
  const body = await readBody(request);

  // Honeypot: bots fill hidden fields. Pretend success so they move on.
  if (body.botcheck || body.company) return json({ ok: true });

  if (await isBot()) return json({ ok: false, error: BOT_BLOCKED_MESSAGE }, 403);

  const email = normalizeEmail(body.email);
  if (!email) return json({ ok: false, error: 'Please enter a valid email address.' }, 400);

  try {
    const name = cleanText(body.name, 100) || undefined;
    const result = await subscribe({ email, name });

    // Heads-up to the team for new and returning subscribers, not repeat submissions.
    // (Contact-form signups are already covered by the contact notification.)
    if (result.status !== 'already_subscribed') {
      try {
        await sendSubscriberNotification({ email, name, resubscribed: result.status === 'resubscribed' });
      } catch (err) {
        // The signup itself succeeded; don't fail the request over the notification.
        console.error('[api/subscribe] notification failed', err);
      }
    }
    return json({ ok: true, status: result.status });
  } catch (err) {
    console.error('[api/subscribe]', err);
    return json({ ok: false, error: 'Something went wrong. Please try again in a moment.' }, 500);
  }
}
