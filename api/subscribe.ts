import { subscribe } from '../src/lib/email/subscribers.js';
import { cleanText, json, normalizeEmail, readBody } from '../src/lib/email/validate.js';

export async function POST(request: Request): Promise<Response> {
  const body = await readBody(request);

  // Honeypot: bots fill hidden fields. Pretend success so they move on.
  if (body.botcheck || body.company) return json({ ok: true });

  const email = normalizeEmail(body.email);
  if (!email) return json({ ok: false, error: 'Please enter a valid email address.' }, 400);

  try {
    const result = await subscribe({ email, name: cleanText(body.name, 100) || undefined });
    return json({ ok: true, status: result.status });
  } catch (err) {
    console.error('[api/subscribe]', err);
    return json({ ok: false, error: 'Something went wrong. Please try again in a moment.' }, 500);
  }
}
