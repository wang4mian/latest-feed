import { c as createComponent, a as createAstro, b as addAttribute, r as renderHead, d as renderSlot, e as renderTemplate } from './astro/server_BM2aJuEc.mjs';

const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title, description = "\u5236\u9020\u4E1A\u51FA\u6D77\u60C5\u62A5\u7CFB\u7EDF" } = Astro2.props;
  return renderTemplate`<html lang="zh-CN"> <head><meta charset="UTF-8"><meta name="description"${addAttribute(description, "content")}><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><title>${title}</title>${renderHead()}</head> <body class="bg-gray-50"> <nav class="bg-white shadow-sm border-b"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="flex justify-between h-16"> <div class="flex items-center"> <h1 class="text-xl font-bold text-primary">制造业情报系统</h1> </div> <div class="flex items-center space-x-4"> <a href="/" class="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">📰 主页</a> <a href="/articles" class="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">📄 文章池</a> <a href="/rss-sources" class="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">📡 RSS源</a> <a href="/workbench" class="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">✏️ 编辑台</a> </div> </div> </div> </nav> <main> ${renderSlot($$result, $$slots["default"])} </main> </body></html>`;
}, "/Users/simianwang/Desktop/latest-feed/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
