/* empty css                                    */
import { c as createComponent, a as createAstro, m as maybeRenderHead, b as addAttribute, e as renderTemplate, f as renderComponent, F as Fragment } from '../chunks/astro/server_0DBvwa-7.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_D1faHx2S.mjs';
import { s as supabase } from '../chunks/supabase_Dfi1qjCo.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$ArticleCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ArticleCard;
  const { article } = Astro2.props;
  const getStatusColor = (status) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "processed":
        return "bg-green-100 text-green-800";
      case "adopted":
        return "bg-purple-100 text-purple-800";
      case "ignored":
        return "bg-gray-100 text-gray-800";
      case "compiled":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("zh-CN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  return renderTemplate`${maybeRenderHead()}<div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"> <div class="flex items-start justify-between mb-3"> <h3 class="font-semibold text-lg text-gray-900 leading-tight"> ${article.raw_content?.headline || "\u65E0\u6807\u9898"} </h3> <span${addAttribute(`px-2 py-1 text-xs rounded-full ${getStatusColor(article.status)}`, "class")}> ${article.status} </span> </div> <p class="text-gray-600 text-sm mb-4 line-clamp-3"> ${article.ai_translation ? article.ai_translation.substring(0, 120) + "..." : "\u6682\u65E0\u7FFB\u8BD1"} </p> <div class="flex items-center justify-between mb-4"> <div class="flex items-center space-x-2"> <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
评分: ${article.value_score || 0}/10
</span> ${article.target_audience && article.target_audience.length > 0 && renderTemplate`<span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"> ${article.target_audience[0]} </span>`} </div> <span class="text-xs text-gray-500"> ${formatDate(article.created_at)} </span> </div> <div class="flex space-x-2"> ${article.status === "processed" && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate` <button${addAttribute(`adoptArticle('${article.id}')`, "onclick")} class="flex-1 px-3 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors">
采用
</button> <button${addAttribute(`ignoreArticle('${article.id}')`, "onclick")} class="flex-1 px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors">
忽略
</button> ` })}`} ${article.status === "adopted" && renderTemplate`<a${addAttribute(`/workbench?article=${article.id}`, "href")} class="flex-1 text-center px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors">
编辑
</a>`} </div> </div>`;
}, "/Users/simianwang/Desktop/latest-feed/src/components/ArticleCard.astro", void 0);

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const { data: articles, error } = await supabase.from("articles").select("*").eq("status", "processed").order("value_score", { ascending: false }).limit(20);
  if (error) {
    console.error("\u83B7\u53D6\u6587\u7AE0\u5931\u8D25:", error);
  }
  const { data: categories } = await supabase.from("rss_sources").select("category").eq("is_active", true);
  const uniqueCategories = [...new Set(categories?.map((c) => c.category) || [])];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "\u5236\u9020\u4E1A\u60C5\u62A5\u7CFB\u7EDF - \u4E3B\u9875", "data-astro-cid-j7pv25f6": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-astro-cid-j7pv25f6> <!-- 主题选择标签 --> <div class="bg-white shadow rounded-lg mb-6" data-astro-cid-j7pv25f6> <div class="border-b border-gray-200" data-astro-cid-j7pv25f6> <nav class="-mb-px flex space-x-8 px-6" aria-label="主题" data-astro-cid-j7pv25f6> <button onclick="selectCategory('all')" class="category-tab active py-4 px-1 border-b-2 font-medium text-sm" data-astro-cid-j7pv25f6>
🌐 全部主题
</button> ${uniqueCategories.map((category) => renderTemplate`<button${addAttribute(`selectCategory('${category}')`, "onclick")} class="category-tab py-4 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300" data-astro-cid-j7pv25f6> ${category === "3D\u6253\u5370" ? "\u{1F5A8}\uFE0F" : "\u{1F4C8}"} ${category} </button>`)} </nav> </div> </div> <!-- 文章列表 --> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="articles-container" data-astro-cid-j7pv25f6> ${articles?.map((article) => renderTemplate`${renderComponent($$result2, "ArticleCard", $$ArticleCard, { "article": article, "data-astro-cid-j7pv25f6": true })}`)} </div> ${(!articles || articles.length === 0) && renderTemplate`<div class="text-center py-12" data-astro-cid-j7pv25f6> <p class="text-gray-500" data-astro-cid-j7pv25f6>暂无文章数据</p> </div>`} </div>   ` })}`;
}, "/Users/simianwang/Desktop/latest-feed/src/pages/index.astro", void 0);

const $$file = "/Users/simianwang/Desktop/latest-feed/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
