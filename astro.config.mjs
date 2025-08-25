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
      // 只在生产环境打包所有依赖，避免模块找不到的问题
      noExternal: process.env.NODE_ENV === 'production' ? true : ['@supabase/supabase-js']
    }
  }
});