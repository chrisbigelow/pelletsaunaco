// Vercel Function: creates the refundable P1 pre-order deposit as a Stripe PaymentIntent.
// The card is saved to the customer (setup_future_usage: off_session) so the remaining
// balance can be charged when production begins.
//
// Env: STRIPE_SECRET_KEY (server only). The browser uses PUBLIC_STRIPE_PUBLISHABLE_KEY.
import Stripe from 'stripe';

// Keep in sync with src/lib/campaign.ts (deposit is in dollars there).
const DEPOSIT_CENTS = 100_00;
const CURRENCY = 'usd';
const ALLOWED_COUNTRIES = new Set(['US', 'CA']);

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

const clean = (value, max = 200) => (typeof value === 'string' ? value.trim().slice(0, max) : '');

export async function POST(request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return json({ error: 'Payments are not configured yet.' }, 503);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }

  const email = clean(body?.email, 254).toLowerCase();
  const name = clean(body?.name, 120);
  const phone = clean(body?.phone, 40);
  const marketingOptIn = body?.marketingOptIn === true;
  const a = body?.address ?? {};
  const address = {
    line1: clean(a.line1),
    line2: clean(a.line2) || undefined,
    city: clean(a.city, 100),
    state: clean(a.state, 100),
    postal_code: clean(a.postal_code, 20),
    country: clean(a.country, 2).toUpperCase(),
  };

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: 'Please enter a valid email.' }, 400);
  if (!name) return json({ error: 'Please enter your name.' }, 400);
  if (!address.line1 || !address.city || !address.postal_code || !ALLOWED_COUNTRIES.has(address.country)) {
    return json({ error: 'We currently ship to the US and Canada only.' }, 400);
  }

  const stripe = new Stripe(secretKey);

  try {
    const shipping = { name, phone: phone || undefined, address };
    // Record the email-list choice on the customer too, so it isn't lost if the list signup fails.
    const metadata = { email_list_opt_in: marketingOptIn ? 'yes' : 'no' };
    const existing = await stripe.customers.list({ email, limit: 1 });
    const customer = existing.data[0]
      ? await stripe.customers.update(existing.data[0].id, { name, phone: phone || undefined, address, shipping, metadata })
      : await stripe.customers.create({ email, name, phone: phone || undefined, address, shipping, metadata });

    const intent = await stripe.paymentIntents.create({
      amount: DEPOSIT_CENTS,
      currency: CURRENCY,
      customer: customer.id,
      payment_method_types: ['card'],
      setup_future_usage: 'off_session',
      receipt_email: email,
      shipping,
      description: 'P1 Pellet Sauna Stove pre-order deposit (refundable)',
      statement_descriptor_suffix: 'P1 DEPOSIT',
      metadata: { type: 'preorder_deposit', product: 'P1', ...metadata },
    });

    return json({ clientSecret: intent.client_secret });
  } catch (err) {
    console.error('preorder: stripe error', err?.type, err?.message);
    return json({ error: 'We couldn’t start the payment. Please try again.' }, 502);
  }
}
