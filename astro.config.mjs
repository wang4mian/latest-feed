import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  integrations: [tailwind()],
  output: 'server',
  adapter: vercel({
    functionPerRoute: false,
    edgeMiddleware: false,
    runtime: 'nodejs20.x'  // 强制使用Node.js 20
  }),
  server: {
    port: 4321,
    host: true
  }
});