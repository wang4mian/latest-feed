import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  integrations: [tailwind()],
  output: 'server',
  adapter: vercel({
    functionPerRoute: false,
    edgeMiddleware: false
  }),
  server: {
    port: 4321,
    host: true
  },
  vite: {
    ssr: {
      // 确保这些依赖被正确打包到Serverless函数中
      noExternal: ['cookie', 'set-cookie-parser']
    }
  }
});