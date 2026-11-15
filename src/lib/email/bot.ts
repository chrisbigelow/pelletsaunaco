import { checkBotId } from 'botid/server';

/**
 * Vercel BotID check for the public form endpoints. The browser side is set up
 * in BaseLayout.astro (initBotId), which must list every path that calls this.
 * Requests that didn't come from a real browser session on the site (scripts,
 * curl, headless bots) are flagged. Always "not a bot" in local development.
 */
export async function isBot(): Promise<boolean> {
  try {
    const verification = await checkBotId();
    return verification.isBot;
  } catch (err) {
    // If BotID itself is unavailable, let the request through rather than
    // turning away real customers; the honeypot fields still apply.
    console.error('[botid] check failed', err);
    return false;
  }
}

export const BOT_BLOCKED_MESSAGE =
  'We couldn’t verify your browser. Please refresh the page and try again, or email hello@pelletsauna.com.';
