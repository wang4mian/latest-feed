/* empty css                                    */
import { c as createComponent, a as createAstro, f as renderComponent, e as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../chunks/astro/server_0DBvwa-7.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_D1faHx2S.mjs';
import { g as getWorkbenchArticles } from '../chunks/supabase_X1KeQV3a.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$WorkbenchOld = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$WorkbenchOld;
  const url = Astro2.url;
  const status = url.searchParams.getAll("status");
  const category = url.searchParams.get("category");
  const sort_by = url.searchParams.get("sort_by") || "created_at";
  const sort_order = url.searchParams.get("sort_order") || "desc";
  const filters = {
    status: status.length > 0 ? status : ["adopted"],
    category: category || void 0,
    sort_by,
    sort_order
  };
  const { data: articles, error } = await getWorkbenchArticles(filters);
  if (error) {
    console.error("\u83B7\u53D6\u5DE5\u4F5C\u53F0\u6587\u7AE0\u5931\u8D25:", error);
  }
  const { data: categories } = await supabase.from("rss_sources").select("category").eq("is_active", true);
  const uniqueCategories = [...new Set(categories?.map((c) => c.category) || [])];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "\u5DE5\u4F5C\u53F0 - \u5236\u9020\u4E1A\u60C5\u62A5\u7CFB\u7EDF" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> <!-- 工作台标题 --> <div class="mb-8"> <h1 class="text-3xl font-bold text-gray-900">✏️ 编辑台</h1> <p class="mt-2 text-gray-600">使用 Doocs MD 编辑器进行文章编译和发布</p> </div> <!-- 筛选面板 --> <div class="bg-white shadow rounded-lg mb-6 p-6"> <div class="grid grid-cols-1 md:grid-cols-4 gap-4"> <!-- 状态筛选 --> <div> <label class="block text-sm font-medium text-gray-700 mb-2">状态</label> <select id="status-filter" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"> <option value="adopted">已采用</option> <option value="compiled">已编译</option> <option value="all">全部</option> </select> </div> <!-- 主题筛选 --> <div> <label class="block text-sm font-medium text-gray-700 mb-2">主题</label> <select id="category-filter" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"> <option value="all">全部主题</option> ${uniqueCategories.map((category2) => renderTemplate`<option${addAttribute(category2, "value")}>${category2}</option>`)} </select> </div> <!-- 排序方式 --> <div> <label class="block text-sm font-medium text-gray-700 mb-2">排序</label> <select id="sort-filter" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"> <option value="created_at_desc">最新优先</option> <option value="value_score_desc">评分优先</option> <option value="created_at_asc">最旧优先</option> </select> </div> <!-- 操作按钮 --> <div class="flex items-end"> <button id="apply-filters" class="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
应用筛选
</button> </div> </div> </div> <!-- 文章列表 --> <div class="space-y-4" id="workbench-articles"> ${articles?.map((article) => renderTemplate`<div class="bg-white rounded-lg shadow-md p-6"> <div class="flex items-start justify-between"> <div class="flex-1"> <h3 class="font-semibold text-lg mb-2">${article.raw_content?.headline || "\u65E0\u6807\u9898"}</h3> <p class="text-gray-600 text-sm mb-3"> ${article.ai_translation ? article.ai_translation.substring(0, 200) + "..." : "\u6682\u65E0\u7FFB\u8BD1"} </p> <div class="flex items-center space-x-3 text-xs text-gray-500"> <span>评分: ${article.value_score}/10</span> <span>状态: ${article.status}</span> <span>${new Date(article.created_at).toLocaleString("zh-CN")}</span> </div> </div> <div class="ml-4 flex flex-col space-y-2"> <button${addAttribute(`editArticle('${article.id}')`, "onclick")} class="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
编辑
</button> ${article.status === "adopted" && renderTemplate`<button${addAttribute(`markCompiled('${article.id}')`, "onclick")} class="px-4 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600">
标记已编译
</button>`} </div> </div> </div>`)} </div> ${(!articles || articles.length === 0) && renderTemplate`<div class="text-center py-12"> <p class="text-gray-500">暂无符合条件的文章</p> </div>`} </div>  <div id="editor-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50"> <div class="flex items-center justify-center h-full p-4"> <div class="bg-white rounded-lg w-full max-w-6xl h-5/6 flex flex-col"> <div class="flex items-center justify-between p-4 border-b"> <h2 class="text-lg font-semibold">文章编辑器</h2> <div class="flex items-center space-x-2"> <button id="sync-content" class="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
同步内容
</button> <button id="save-article" class="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600">
保存
</button> <button onclick="closeEditor()" class="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600">
关闭
</button> </div> </div> <div class="flex-1"> <iframe id="editor-iframe" src="/doocs-editor.html" class="w-full h-full border-0"></iframe> </div> <textarea id="hidden-content" class="hidden"></textarea> </div> </div> </div>  ` })}`;
}, "/Users/simianwang/Desktop/latest-feed/src/pages/workbench-old.astro", void 0);

const $$file = "/Users/simianwang/Desktop/latest-feed/src/pages/workbench-old.astro";
const $$url = "/workbench-old";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$WorkbenchOld,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
