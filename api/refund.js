// Vercel Function: lets a buyer look up their P1 pre-order deposits and refund one.
//
// The buyer proves ownership with the email AND the shipping ZIP/postal code used at checkout;
// every refund request re-checks both, so a payment ID on its own can't be refunded.
//
// POST { action: 'lookup', email, postalCode }
// POST { action: 'refund', email, postalCode, orderId, reason? }
import { clean, getStripe, isEmail, json } from './_stripe.js';

const MAX_CUSTOMERS = 5;

// US ZIPs compare on the first five digits; Canadian postal codes ignore spaces and case.
const normalizePostal = (value) => {
  const compact = String(value ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  return /^\d{5}/.test(compact) ? compact.slice(0, 5) : compact;
};

const notFound = () =>
  json({ error: 'We couldn’t find a reservation with that email and ZIP/postal code. Check both match what you entered at checkout.' }, 404);

/** All pre-order deposits paid by this email whose shipping postal code matches. */
async function findDeposits(stripe, email, postalCode) {
  const wanted = normalizePostal(postalCode);
  const customers = await stripe.customers.list({ email, limit: MAX_CUSTOMERS });
  const deposits = [];

  for (const customer of customers.data) {
    const intents = await stripe.paymentIntents.list({
      customer: customer.id,
      limit: 100,
      expand: ['data.latest_charge'],
    });
    for (const pi of intents.data) {
      if (pi.metadata?.type !== 'preorder_deposit' || pi.status !== 'succeeded') continue;
      if (normalizePostal(pi.shipping?.address?.postal_code) !== wanted) continue;
      deposits.push(pi);
    }
  }
  return deposits.sort((a, b) => b.created - a.created);
}

const toOrder = (pi) => {
  const charge = typeof pi.latest_charge === 'object' ? pi.latest_charge : null;
  const refundedAmount = charge?.amount_refunded ?? 0;
  const card = charge?.payment_method_details?.card;
  const addr = pi.shipping?.address;
  return {
    id: pi.id,
    reference: pi.id.slice(-8).toUpperCase(),
    created: pi.created,
    amount: pi.amount,
    currency: pi.currency,
    refunded: refundedAmount >= pi.amount,
    refundPending: pi.metadata?.refund_requested === 'yes' && refundedAmount < pi.amount,
    card: card ? { brand: card.brand, last4: card.last4 } : null,
    shipTo: addr ? [addr.city, addr.state].filter(Boolean).join(', ') : '',
  };
};

export async function POST(request) {
  const stripe = getStripe();
  if (!stripe) return json({ error: 'Refunds aren’t available online yet. Please use the contact form.' }, 503);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }

  const action = body?.action;
  const email = clean(body?.email, 254).toLowerCase();
  const postalCode = clean(body?.postalCode, 20);
  if (!isEmail(email) || !normalizePostal(postalCode)) {
    return json({ error: 'Please enter the email and ZIP/postal code you used at checkout.' }, 400);
  }

  try {
    const deposits = await findDeposits(stripe, email, postalCode);
    if (!deposits.length) return notFound();

    if (action === 'lookup') {
      return json({ orders: deposits.map(toOrder) });
    }

    if (action === 'refund') {
      const orderId = clean(body?.orderId, 100);
      const reason = clean(body?.reason, 500);
      const pi = deposits.find((d) => d.id === orderId);
      if (!pi) return notFound();

      const order = toOrder(pi);
      if (order.refunded) return json({ order, alreadyRefunded: true });

      await stripe.refunds.create(
        {
          payment_intent: pi.id,
          reason: 'requested_by_customer',
          metadata: { source: 'refund_page', customer_reason: reason || '(none given)' },
        },
        // Double-clicks and retries create one refund, not several.
        { idempotencyKey: `refund-${pi.id}` }
      );

      await stripe.paymentIntents.update(pi.id, {
        metadata: { refund_requested: 'yes', refund_reason: reason || '(none given)' },
      });

      // Forget the saved card unless another active deposit still needs it.
      const stillActive = deposits.some((d) => d.id !== pi.id && !toOrder(d).refunded);
      const paymentMethod = typeof pi.payment_method === 'string' ? pi.payment_method : pi.payment_method?.id;
      if (paymentMethod && !stillActive) {
        await stripe.paymentMethods.detach(paymentMethod).catch((err) => console.error('refund: detach failed', err?.message));
      }

      const [updated] = (await findDeposits(stripe, email, postalCode)).filter((d) => d.id === pi.id);
      return json({ order: toOrder(updated ?? pi) });
    }

    return json({ error: 'Invalid request.' }, 400);
  } catch (err) {
    console.error('refund: stripe error', err?.type, err?.message);
    return json({ error: 'Something went wrong. Please try again, or contact us and we’ll refund you by hand.' }, 502);
  }
}
