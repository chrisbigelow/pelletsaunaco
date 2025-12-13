import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/static';

export default defineConfig({
  site: 'https://pelletsaunaco.com', // Update this with your actual domain
  output: 'static',
  adapter: vercel(),
});
