import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/static';

export default defineConfig({
  site: 'https://pelletsauna.com',
  output: 'static',
  adapter: vercel(),
});
