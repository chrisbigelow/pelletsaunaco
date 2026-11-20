// Product feed for Google Merchant Center (free Shopping listings). Merchant Center fetches this
// URL daily, so price and ship date follow src/lib/campaign.ts without manual updates there.
// Title, description, and images mirror the Product markup in p1-pellet-sauna-stove.astro; keep the two in sync.
import type { APIRoute } from 'astro';
import { campaign } from '../lib/campaign';
import { productPath } from '../lib/site';

const images = [
  '/images/p1/ld-front-chimney.jpg',
  '/images/p1/ld-through-wall.jpg',
  '/images/p1/ld-angle-sunset.jpg',
  '/images/p1/ld-front-fire.jpg',
];

const escapeXml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: APIRoute = ({ site }) => {
  const abs = (path: string) => escapeXml(new URL(path, site).href);
  const [mainImage, ...moreImages] = images;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>The Pellet Sauna Company</title>
    <link>${abs('/')}</link>
    <description>Products from The Pellet Sauna Company</description>
    <item>
      <g:id>P1</g:id>
      <g:title>P1 Pellet Sauna Stove</g:title>
      <g:description>${escapeXml('Wood pellet sauna stove for 210–500 ft³ saunas. Plugs into a standard 110V outlet, with remote start and 12–15 hours of runtime on a single hopper load.')}</g:description>
      <g:link>${abs(productPath)}</g:link>
      <g:image_link>${abs(mainImage)}</g:image_link>
${moreImages.map((src) => `      <g:additional_image_link>${abs(src)}</g:additional_image_link>`).join('\n')}
      <g:availability>preorder</g:availability>
      <g:availability_date>${campaign.shipDate}</g:availability_date>
      <g:price>${campaign.price.toFixed(2)} USD</g:price>
      <g:condition>new</g:condition>
      <g:brand>The Pellet Sauna Company</g:brand>
      <g:mpn>P1</g:mpn>
    </item>
  </channel>
</rss>
`;

  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
