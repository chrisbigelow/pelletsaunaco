/**
 * Shared, email-client-safe wrapper (tables + inline styles) matching the site:
 * Instrument Serif headings, Inter body, cream canvas, pine header/footer.
 * The header lockup is an image because most clients block SVG and web fonts.
 */
const SITE = 'https://www.pelletsauna.com';
export const SERIF = "'Instrument Serif', Georgia, 'Times New Roman', serif";
export const SANS = "Inter, Arial, Helvetica, sans-serif";

export function emailLayout(params: { preheader: string; body: string; footer?: string }): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="color-scheme" content="light only" />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Instrument+Serif&display=swap" rel="stylesheet" />
<title>The Pellet Sauna Company</title>
</head>
<body style="margin:0;padding:0;background-color:#f6f1e7;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${params.preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f6f1e7" style="background-color:#f6f1e7;">
  <tr><td align="center" style="padding-top:32px;padding-right:16px;padding-bottom:32px;padding-left:16px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#fffcf6" style="max-width:600px;background-color:#fffcf6;border:1px solid #ece4d4;">
      <tr><td bgcolor="#384629" style="background-color:#384629;">
        <a href="${SITE}" style="display:block;"><img src="${SITE}/email/header.png" width="600" height="112" alt="The Pellet Sauna Company — Effortless Wood-Fired Saunas" border="0" style="display:block;width:100%;max-width:600px;height:auto;border:0;color:#f6f1e7;font-family:${SERIF};font-size:22px;" /></a>
      </td></tr>
      <tr><td style="padding-top:40px;padding-right:40px;padding-bottom:32px;padding-left:40px;font-family:${SANS};font-size:16px;line-height:1.65;color:#2b2a22;">
        ${params.body}
      </td></tr>
      <tr><td bgcolor="#384629" style="background-color:#384629;padding-top:28px;padding-right:40px;padding-bottom:0;padding-left:40px;font-family:${SANS};font-size:12px;line-height:1.6;color:#d9cfb4;text-align:center;">
        ${params.footer ?? ''}
        <p style="margin:0 0 24px;font-family:${SANS};font-size:12px;line-height:1.6;color:#d9cfb4;">The Pellet Sauna Company &middot; <a href="${SITE}" style="color:#f1eadc;">pelletsauna.com</a><br />&copy; 2026 The Pellet Sauna Company</p>
      </td></tr>
      <tr><td bgcolor="#384629" style="background-color:#384629;line-height:0;font-size:0;">
        <img src="${SITE}/email/footer-landscape.jpg" width="600" height="203" alt="" border="0" style="display:block;width:100%;max-width:600px;height:auto;border:0;" />
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}
