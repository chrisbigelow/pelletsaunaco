/**
 * Shared, email-client-safe wrapper (tables + inline styles) using the site palette.
 */
export function emailLayout(params: { preheader: string; body: string; footer?: string }): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light only" />
<title>The Pellet Sauna Company</title>
</head>
<body style="margin:0;padding:0;background:#f6f1e7;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${params.preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f1e7;">
  <tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fffcf6;border:1px solid #ece4d4;">
      <tr><td style="background:#384629;padding:24px 32px;">
        <p style="margin:0;font-family:Georgia,serif;font-size:20px;color:#f6f1e7;">The Pellet Sauna Company</p>
        <p style="margin:4px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:1px;color:#d9cfb4;">Effortless Wood-Fired Saunas</p>
      </td></tr>
      <tr><td style="padding:32px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:#2b2a22;">
        ${params.body}
      </td></tr>
      <tr><td style="padding:20px 32px;border-top:1px solid #ece4d4;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.5;color:#6b675a;">
        ${params.footer ?? ''}
        <p style="margin:0;">The Pellet Sauna Company &middot; <a href="https://www.pelletsauna.com" style="color:#6b675a;">pelletsauna.com</a></p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}
