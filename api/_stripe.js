// Shared helpers for the Stripe Vercel Functions. Files starting with "_" are not deployed as routes.
import Stripe from 'stripe';

export const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

export const clean = (value, max = 200) => (typeof value === 'string' ? value.trim().slice(0, max) : '');

export const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

let client = null;

/** Returns the Stripe client, or null when STRIPE_SECRET_KEY isn't configured. */
export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return null;
  client ??= new Stripe(secretKey);
  return client;
}
