/* empty css                                    */
import { c as createComponent, f as renderComponent, e as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../chunks/astro/server_BM2aJuEc.mjs';
import { $ as $$Layout } from '../chunks/Layout_D7fvp0Pm.mjs';
import { s as supabase } from '../chunks/supabase_DhlB0YS7.mjs';
export { renderers } from '../renderers.mjs';

const $$RssSources = createComponent(async ($$result, $$props, $$slots) => {
  const { data: rssResources, error } = await supabase.from("rss_sources").select("*").order("created_at", { ascending: false });
  if (error) {
    console.error("\u83B7\u53D6RSS\u8D44\u6E90\u6570\u636E\u5931\u8D25:", error);
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "RSS\u6E90\u7BA1\u7406 - RSS Resources" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-7xl mx-auto px-4 py-8"> <h1 class="text-2xl font-bold mb-6">📡 RSS源管理 (RSS Resources)</h1> <p class="mb-4">总计 ${rssResources?.length || 0} 个RSS源</p> ${error && renderTemplate`<div class="bg-red-100 text-red-800 p-4 rounded mb-4">
错误: ${error.message} </div>`} <div class="overflow-x-auto"> <table class="min-w-full border border-gray-300"> <thead class="bg-gray-100"> <tr> <th class="border px-4 py-2">ID</th> <th class="border px-4 py-2">Name</th> <th class="border px-4 py-2">URL</th> <th class="border px-4 py-2">Category</th> <th class="border px-4 py-2">Region</th> <th class="border px-4 py-2">Is Active</th> <th class="border px-4 py-2">Description</th> <th class="border px-4 py-2">Crawl Strategy</th> <th class="border px-4 py-2">Success Rate</th> <th class="border px-4 py-2">Last Fetch</th> <th class="border px-4 py-2">Error Message</th> <th class="border px-4 py-2">Created At</th> </tr> </thead> <tbody> ${rssResources?.map((source) => renderTemplate`<tr class="hover:bg-gray-50"> <td class="border px-4 py-2 text-sm">${source.id}</td> <td class="border px-4 py-2 text-sm font-medium">${source.name}</td> <td class="border px-4 py-2 text-sm max-w-xs truncate"> <a${addAttribute(source.url, "href")} target="_blank" class="text-blue-600 hover:underline"> ${source.url} </a> </td> <td class="border px-4 py-2 text-sm"> <span${addAttribute(`px-2 py-1 rounded text-xs ${source.category === "Technology" ? "bg-blue-100 text-blue-800" : source.category === "Business" ? "bg-green-100 text-green-800" : source.category === "Policy" ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-800"}`, "class")}> ${source.category} </span> </td> <td class="border px-4 py-2 text-sm">${source.region}</td> <td class="border px-4 py-2 text-sm"> <span${addAttribute(`px-2 py-1 rounded text-xs ${source.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`, "class")}> ${source.is_active ? "\u2705 \u6FC0\u6D3B" : "\u274C \u672A\u6FC0\u6D3B"} </span> </td> <td class="border px-4 py-2 text-sm max-w-xs">${source.description || "-"}</td> <td class="border px-4 py-2 text-sm"> <span${addAttribute(`px-2 py-1 rounded text-xs ${source.crawl_strategy === "google_news" ? "bg-yellow-100 text-yellow-800" : source.crawl_strategy === "anti_scraping" ? "bg-red-100 text-red-800" : source.crawl_strategy === "javascript_heavy" ? "bg-orange-100 text-orange-800" : "bg-gray-100 text-gray-800"}`, "class")}> ${source.crawl_strategy} </span> </td> <td class="border px-4 py-2 text-sm"> ${source.success_rate ? `${source.success_rate}%` : "-"} </td> <td class="border px-4 py-2 text-sm"> ${source.last_fetch ? new Date(source.last_fetch).toLocaleString("zh-CN") : "-"} </td> <td class="border px-4 py-2 text-sm max-w-xs"> ${source.last_error ? renderTemplate`<details> <summary class="cursor-pointer text-red-600">查看错误</summary> <div class="text-xs mt-2 max-h-20 overflow-y-auto text-red-700"> ${source.last_error} </div> </details>` : "-"} </td> <td class="border px-4 py-2 text-sm"> ${new Date(source.created_at).toLocaleString("zh-CN")} </td> </tr>`)} </tbody> </table> </div> ${(!rssResources || rssResources.length === 0) && renderTemplate`<div class="text-center py-8"> <p class="text-gray-500">暂无RSS源数据</p> </div>`} </div> ` })}`;
}, "/Users/simianwang/Desktop/latest-feed/src/pages/rss-sources.astro", void 0);

const $$file = "/Users/simianwang/Desktop/latest-feed/src/pages/rss-sources.astro";
const $$url = "/rss-sources";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$RssSources,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
