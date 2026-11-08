/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  /** Stripe publishable key (pk_test_… / pk_live_…) for the pre-order deposit pop-up. */
  readonly PUBLIC_STRIPE_PUBLISHABLE_KEY?: string;
}
