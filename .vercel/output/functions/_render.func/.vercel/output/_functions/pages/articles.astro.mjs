/* empty css                                    */
import { c as createComponent, f as renderComponent, e as renderTemplate, g as defineScriptVars, b as addAttribute, F as Fragment, m as maybeRenderHead } from '../chunks/astro/server_0DBvwa-7.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_D1faHx2S.mjs';
import { s as supabase } from '../chunks/supabase_X1KeQV3a.mjs';
/* empty css                                    */
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Articles = createComponent(async ($$result, $$props, $$slots) => {
  const { data: articles, error } = await supabase.from("articles").select("*").order("created_at", { ascending: false });
  if (error) {
    console.error("\u83B7\u53D6\u6587\u7AE0\u6570\u636E\u5931\u8D25:", error);
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "\u6587\u7AE0\u6C60 - Articles", "data-astro-cid-xvukugm6": true }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([" ", '<div class="max-w-7xl mx-auto px-4 py-8" data-astro-cid-xvukugm6> <div class="mb-8" data-astro-cid-xvukugm6> <h1 class="text-3xl font-bold text-gray-900" data-astro-cid-xvukugm6>\u{1F4F0} \u6587\u7AE0\u6C60</h1> <p class="mt-2 text-gray-600" data-astro-cid-xvukugm6>\u7B5B\u9009\u548C\u7BA1\u7406 RSS \u6293\u53D6\u7684\u6587\u7AE0\uFF0C\u70B9\u51FB"\u91C7\u7528"\u6216"\u5FFD\u7565"\u8FDB\u884C\u5904\u7406</p> </div> <!-- \u7EDF\u8BA1\u5361\u7247 --> <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6" data-astro-cid-xvukugm6> <div class="bg-white rounded-lg shadow p-4 text-center" data-astro-cid-xvukugm6> <div class="text-2xl font-bold text-blue-600" data-astro-cid-xvukugm6>', '</div> <div class="text-sm text-gray-600" data-astro-cid-xvukugm6>\u603B\u6587\u7AE0</div> </div> <div class="bg-white rounded-lg shadow p-4 text-center" data-astro-cid-xvukugm6> <div class="text-2xl font-bold text-green-600" data-astro-cid-xvukugm6>', '</div> <div class="text-sm text-gray-600" data-astro-cid-xvukugm6>\u5DF2\u5904\u7406</div> </div> <div class="bg-white rounded-lg shadow p-4 text-center" data-astro-cid-xvukugm6> <div class="text-2xl font-bold text-yellow-600" data-astro-cid-xvukugm6>', '</div> <div class="text-sm text-gray-600" data-astro-cid-xvukugm6>\u5DF2\u91C7\u7528</div> </div> <div class="bg-white rounded-lg shadow p-4 text-center" data-astro-cid-xvukugm6> <div class="text-2xl font-bold text-purple-600" data-astro-cid-xvukugm6>', '</div> <div class="text-sm text-gray-600" data-astro-cid-xvukugm6>\u5DF2\u7F16\u8BD1</div> </div> <div class="bg-white rounded-lg shadow p-4 text-center" data-astro-cid-xvukugm6> <div class="text-2xl font-bold text-red-600" data-astro-cid-xvukugm6>', `</div> <div class="text-sm text-gray-600" data-astro-cid-xvukugm6>\u5DF2\u5FFD\u7565</div> </div> </div> <!-- \u72B6\u6001\u7B5B\u9009 --> <div class="bg-white shadow rounded-lg mb-6 p-4" data-astro-cid-xvukugm6> <div class="flex flex-wrap gap-2" data-astro-cid-xvukugm6> <button onclick="filterArticles('all')" class="filter-btn active px-4 py-2 rounded-lg text-sm" data-astro-cid-xvukugm6>\u5168\u90E8</button> <button onclick="filterArticles('new')" class="filter-btn px-4 py-2 rounded-lg text-sm bg-gray-100" data-astro-cid-xvukugm6>\u65B0\u6587\u7AE0</button> <button onclick="filterArticles('processed')" class="filter-btn px-4 py-2 rounded-lg text-sm bg-gray-100" data-astro-cid-xvukugm6>\u5DF2\u5904\u7406</button> <button onclick="filterArticles('adopted')" class="filter-btn px-4 py-2 rounded-lg text-sm bg-gray-100" data-astro-cid-xvukugm6>\u5DF2\u91C7\u7528</button> <button onclick="filterArticles('compiled')" class="filter-btn px-4 py-2 rounded-lg text-sm bg-gray-100" data-astro-cid-xvukugm6>\u5DF2\u7F16\u8BD1</button> <button onclick="filterArticles('ignored')" class="filter-btn px-4 py-2 rounded-lg text-sm bg-gray-100" data-astro-cid-xvukugm6>\u5DF2\u5FFD\u7565</button> </div> </div> `, ' <!-- \u6587\u7AE0\u5217\u8868 --> <div class="space-y-4" id="articles-container" data-astro-cid-xvukugm6> ', " </div> ", " </div> <script>(function(){", `
    // \u7B5B\u9009\u6587\u7AE0
    function filterArticles(filter) {
      const articles = document.querySelectorAll('.article-item')
      const buttons = document.querySelectorAll('.filter-btn')
      
      // \u66F4\u65B0\u6309\u94AE\u72B6\u6001
      buttons.forEach(btn => {
        btn.classList.remove('active', 'bg-blue-500', 'text-white')
        btn.classList.add('bg-gray-100')
      })
      event.target.classList.add('active', 'bg-blue-500', 'text-white')
      event.target.classList.remove('bg-gray-100')
      
      // \u7B5B\u9009\u6587\u7AE0
      articles.forEach(article => {
        const status = article.dataset.status
        const editorAction = article.dataset.editorAction
        
        let show = false
        if (filter === 'all') {
          show = true
        } else if (filter === 'new' && status === 'new') {
          show = true
        } else if (filter === 'processed' && status === 'processed') {
          show = true
        } else if (filter === 'adopted' && editorAction === 'adopted') {
          show = true
        } else if (filter === 'compiled' && editorAction === 'compiled') {
          show = true
        } else if (filter === 'ignored' && editorAction === 'ignored') {
          show = true
        }
        
        article.style.display = show ? 'block' : 'none'
      })
    }

    // \u66F4\u65B0\u6587\u7AE0\u64CD\u4F5C\u72B6\u6001
    async function updateArticleAction(articleId, action) {
      try {
        const response = await fetch('/api/articles/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: articleId,
            editor_action: action,
            status: action === 'adopted' ? 'adopted' : 'processed'
          })
        })
        
        if (response.ok) {
          location.reload()
        } else {
          alert('\u64CD\u4F5C\u5931\u8D25')
        }
      } catch (error) {
        console.error('\u66F4\u65B0\u5931\u8D25:', error)
        alert('\u64CD\u4F5C\u5931\u8D25')
      }
    }

    // \u663E\u793A\u6587\u7AE0\u8BE6\u60C5
    function showArticleDetails(articleId) {
      const article = window.articlesData.find(a => a.id === articleId)
      if (!article) {
        alert('\u6587\u7AE0\u672A\u627E\u5230')
        return
      }
      
      const modal = document.createElement('div')
      modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4'
      modal.onclick = (e) => {
        if (e.target === modal) modal.remove()
      }
      
      const content = document.createElement('div')
      content.className = 'bg-white rounded-lg max-w-4xl w-full max-h-5/6 overflow-y-auto'
      
      const title = article.raw_content?.title || '\u65E0\u6807\u9898'
      const summary = article.ai_analysis?.summary_zh || '\u6682\u65E0\u6458\u8981'
      const valueScore = article.ai_analysis?.value_score || 0
      const keyPoints = article.ai_analysis?.key_points || []
      
      content.innerHTML = \`
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-bold text-gray-900">\${title}</h2>
            <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700">
              \u2715
            </button>
          </div>
          
          <div class="mb-4">
            <div class="flex items-center space-x-4 text-sm text-gray-600 mb-3">
              <span>\u{1F4C5} \${new Date(article.created_at).toLocaleDateString('zh-CN')}</span>
              <span class="px-2 py-1 rounded \${
                valueScore >= 8 ? 'bg-green-100 text-green-800' :
                valueScore >= 6 ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-700'
              }">
                \u2B50 \${valueScore}/10
              </span>
              <span class="px-2 py-1 rounded \${
                article.editor_action === 'adopted' ? 'bg-green-100 text-green-800' :
                article.editor_action === 'ignored' ? 'bg-red-100 text-red-800' :
                article.editor_action === 'compiled' ? 'bg-purple-100 text-purple-800' :
                'bg-gray-100 text-gray-800'
              }">
                \${article.editor_action || article.status}
              </span>
            </div>
            <a href="\${article.source_url}" target="_blank" class="text-blue-600 hover:underline text-sm">
              \u{1F517} \${article.source_url}
            </a>
          </div>
          
          <div class="space-y-4">
            <div>
              <h3 class="font-medium text-gray-900 mb-2">\u{1F4CB} AI\u6458\u8981</h3>
              <p class="text-gray-700 text-sm leading-relaxed">\${summary}</p>
            </div>
            
            \${keyPoints.length > 0 ? \`
            <div>
              <h3 class="font-medium text-gray-900 mb-2">\u{1F50D} \u5173\u952E\u8981\u70B9</h3>
              <ul class="list-disc list-inside space-y-1 text-sm text-gray-700">
                \${keyPoints.map(point => \`<li>\${point}</li>\`).join('')}
              </ul>
            </div>\` : ''}
            
            \${article.final_content ? \`
            <div>
              <h3 class="font-medium text-gray-900 mb-2">\u270F\uFE0F \u7F16\u8F91\u5185\u5BB9</h3>
              <div class="prose prose-sm max-w-none bg-gray-50 p-4 rounded">
                \${article.final_content.split('\\\\n').slice(0, 10).join('<br>')}
                \${article.final_content.split('\\\\n').length > 10 ? '<br><em>...\u5185\u5BB9\u5DF2\u622A\u65AD</em>' : ''}
              </div>
            </div>\` : ''}
          </div>
          
          <div class="mt-6 flex justify-end space-x-2">
            \${article.editor_action === 'adopted' ? \`
              <a href="/workbench?article=\${article.id}" 
                 class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                \u270F\uFE0F \u7F16\u8F91\u6587\u7AE0
              </a>
            \` : ''}
            <button onclick="this.closest('.fixed').remove()" 
                    class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
              \u5173\u95ED
            </button>
          </div>
        </div>
      \`
      
      modal.appendChild(content)
      document.body.appendChild(modal)
    }

    // \u91CD\u7F6E\u6587\u7AE0\u64CD\u4F5C\u72B6\u6001
    async function resetArticleAction(articleId) {
      try {
        const response = await fetch('/api/articles/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: articleId,
            editor_action: null,
            status: 'processed'
          })
        })
        
        if (response.ok) {
          location.reload()
        } else {
          alert('\u91CD\u7F6E\u5931\u8D25')
        }
      } catch (error) {
        console.error('\u91CD\u7F6E\u5931\u8D25:', error)
        alert('\u91CD\u7F6E\u5931\u8D25')
      }
    }

    // \u5B58\u50A8\u6587\u7AE0\u6570\u636E\u5230\u5168\u5C40\u53D8\u91CF\u4F9B\u8BE6\u60C5\u529F\u80FD\u4F7F\u7528
    window.articlesData = articles || []
    
    // \u7ED1\u5B9A\u5230window
    window.filterArticles = filterArticles
    window.updateArticleAction = updateArticleAction
    window.resetArticleAction = resetArticleAction
    window.showArticleDetails = showArticleDetails
  })();<\/script>  `], [" ", '<div class="max-w-7xl mx-auto px-4 py-8" data-astro-cid-xvukugm6> <div class="mb-8" data-astro-cid-xvukugm6> <h1 class="text-3xl font-bold text-gray-900" data-astro-cid-xvukugm6>\u{1F4F0} \u6587\u7AE0\u6C60</h1> <p class="mt-2 text-gray-600" data-astro-cid-xvukugm6>\u7B5B\u9009\u548C\u7BA1\u7406 RSS \u6293\u53D6\u7684\u6587\u7AE0\uFF0C\u70B9\u51FB"\u91C7\u7528"\u6216"\u5FFD\u7565"\u8FDB\u884C\u5904\u7406</p> </div> <!-- \u7EDF\u8BA1\u5361\u7247 --> <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6" data-astro-cid-xvukugm6> <div class="bg-white rounded-lg shadow p-4 text-center" data-astro-cid-xvukugm6> <div class="text-2xl font-bold text-blue-600" data-astro-cid-xvukugm6>', '</div> <div class="text-sm text-gray-600" data-astro-cid-xvukugm6>\u603B\u6587\u7AE0</div> </div> <div class="bg-white rounded-lg shadow p-4 text-center" data-astro-cid-xvukugm6> <div class="text-2xl font-bold text-green-600" data-astro-cid-xvukugm6>', '</div> <div class="text-sm text-gray-600" data-astro-cid-xvukugm6>\u5DF2\u5904\u7406</div> </div> <div class="bg-white rounded-lg shadow p-4 text-center" data-astro-cid-xvukugm6> <div class="text-2xl font-bold text-yellow-600" data-astro-cid-xvukugm6>', '</div> <div class="text-sm text-gray-600" data-astro-cid-xvukugm6>\u5DF2\u91C7\u7528</div> </div> <div class="bg-white rounded-lg shadow p-4 text-center" data-astro-cid-xvukugm6> <div class="text-2xl font-bold text-purple-600" data-astro-cid-xvukugm6>', '</div> <div class="text-sm text-gray-600" data-astro-cid-xvukugm6>\u5DF2\u7F16\u8BD1</div> </div> <div class="bg-white rounded-lg shadow p-4 text-center" data-astro-cid-xvukugm6> <div class="text-2xl font-bold text-red-600" data-astro-cid-xvukugm6>', `</div> <div class="text-sm text-gray-600" data-astro-cid-xvukugm6>\u5DF2\u5FFD\u7565</div> </div> </div> <!-- \u72B6\u6001\u7B5B\u9009 --> <div class="bg-white shadow rounded-lg mb-6 p-4" data-astro-cid-xvukugm6> <div class="flex flex-wrap gap-2" data-astro-cid-xvukugm6> <button onclick="filterArticles('all')" class="filter-btn active px-4 py-2 rounded-lg text-sm" data-astro-cid-xvukugm6>\u5168\u90E8</button> <button onclick="filterArticles('new')" class="filter-btn px-4 py-2 rounded-lg text-sm bg-gray-100" data-astro-cid-xvukugm6>\u65B0\u6587\u7AE0</button> <button onclick="filterArticles('processed')" class="filter-btn px-4 py-2 rounded-lg text-sm bg-gray-100" data-astro-cid-xvukugm6>\u5DF2\u5904\u7406</button> <button onclick="filterArticles('adopted')" class="filter-btn px-4 py-2 rounded-lg text-sm bg-gray-100" data-astro-cid-xvukugm6>\u5DF2\u91C7\u7528</button> <button onclick="filterArticles('compiled')" class="filter-btn px-4 py-2 rounded-lg text-sm bg-gray-100" data-astro-cid-xvukugm6>\u5DF2\u7F16\u8BD1</button> <button onclick="filterArticles('ignored')" class="filter-btn px-4 py-2 rounded-lg text-sm bg-gray-100" data-astro-cid-xvukugm6>\u5DF2\u5FFD\u7565</button> </div> </div> `, ' <!-- \u6587\u7AE0\u5217\u8868 --> <div class="space-y-4" id="articles-container" data-astro-cid-xvukugm6> ', " </div> ", " </div> <script>(function(){", `
    // \u7B5B\u9009\u6587\u7AE0
    function filterArticles(filter) {
      const articles = document.querySelectorAll('.article-item')
      const buttons = document.querySelectorAll('.filter-btn')
      
      // \u66F4\u65B0\u6309\u94AE\u72B6\u6001
      buttons.forEach(btn => {
        btn.classList.remove('active', 'bg-blue-500', 'text-white')
        btn.classList.add('bg-gray-100')
      })
      event.target.classList.add('active', 'bg-blue-500', 'text-white')
      event.target.classList.remove('bg-gray-100')
      
      // \u7B5B\u9009\u6587\u7AE0
      articles.forEach(article => {
        const status = article.dataset.status
        const editorAction = article.dataset.editorAction
        
        let show = false
        if (filter === 'all') {
          show = true
        } else if (filter === 'new' && status === 'new') {
          show = true
        } else if (filter === 'processed' && status === 'processed') {
          show = true
        } else if (filter === 'adopted' && editorAction === 'adopted') {
          show = true
        } else if (filter === 'compiled' && editorAction === 'compiled') {
          show = true
        } else if (filter === 'ignored' && editorAction === 'ignored') {
          show = true
        }
        
        article.style.display = show ? 'block' : 'none'
      })
    }

    // \u66F4\u65B0\u6587\u7AE0\u64CD\u4F5C\u72B6\u6001
    async function updateArticleAction(articleId, action) {
      try {
        const response = await fetch('/api/articles/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: articleId,
            editor_action: action,
            status: action === 'adopted' ? 'adopted' : 'processed'
          })
        })
        
        if (response.ok) {
          location.reload()
        } else {
          alert('\u64CD\u4F5C\u5931\u8D25')
        }
      } catch (error) {
        console.error('\u66F4\u65B0\u5931\u8D25:', error)
        alert('\u64CD\u4F5C\u5931\u8D25')
      }
    }

    // \u663E\u793A\u6587\u7AE0\u8BE6\u60C5
    function showArticleDetails(articleId) {
      const article = window.articlesData.find(a => a.id === articleId)
      if (!article) {
        alert('\u6587\u7AE0\u672A\u627E\u5230')
        return
      }
      
      const modal = document.createElement('div')
      modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4'
      modal.onclick = (e) => {
        if (e.target === modal) modal.remove()
      }
      
      const content = document.createElement('div')
      content.className = 'bg-white rounded-lg max-w-4xl w-full max-h-5/6 overflow-y-auto'
      
      const title = article.raw_content?.title || '\u65E0\u6807\u9898'
      const summary = article.ai_analysis?.summary_zh || '\u6682\u65E0\u6458\u8981'
      const valueScore = article.ai_analysis?.value_score || 0
      const keyPoints = article.ai_analysis?.key_points || []
      
      content.innerHTML = \\\`
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-bold text-gray-900">\\\${title}</h2>
            <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700">
              \u2715
            </button>
          </div>
          
          <div class="mb-4">
            <div class="flex items-center space-x-4 text-sm text-gray-600 mb-3">
              <span>\u{1F4C5} \\\${new Date(article.created_at).toLocaleDateString('zh-CN')}</span>
              <span class="px-2 py-1 rounded \\\${
                valueScore >= 8 ? 'bg-green-100 text-green-800' :
                valueScore >= 6 ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-700'
              }">
                \u2B50 \\\${valueScore}/10
              </span>
              <span class="px-2 py-1 rounded \\\${
                article.editor_action === 'adopted' ? 'bg-green-100 text-green-800' :
                article.editor_action === 'ignored' ? 'bg-red-100 text-red-800' :
                article.editor_action === 'compiled' ? 'bg-purple-100 text-purple-800' :
                'bg-gray-100 text-gray-800'
              }">
                \\\${article.editor_action || article.status}
              </span>
            </div>
            <a href="\\\${article.source_url}" target="_blank" class="text-blue-600 hover:underline text-sm">
              \u{1F517} \\\${article.source_url}
            </a>
          </div>
          
          <div class="space-y-4">
            <div>
              <h3 class="font-medium text-gray-900 mb-2">\u{1F4CB} AI\u6458\u8981</h3>
              <p class="text-gray-700 text-sm leading-relaxed">\\\${summary}</p>
            </div>
            
            \\\${keyPoints.length > 0 ? \\\`
            <div>
              <h3 class="font-medium text-gray-900 mb-2">\u{1F50D} \u5173\u952E\u8981\u70B9</h3>
              <ul class="list-disc list-inside space-y-1 text-sm text-gray-700">
                \\\${keyPoints.map(point => \\\`<li>\\\${point}</li>\\\`).join('')}
              </ul>
            </div>\\\` : ''}
            
            \\\${article.final_content ? \\\`
            <div>
              <h3 class="font-medium text-gray-900 mb-2">\u270F\uFE0F \u7F16\u8F91\u5185\u5BB9</h3>
              <div class="prose prose-sm max-w-none bg-gray-50 p-4 rounded">
                \\\${article.final_content.split('\\\\\\\\n').slice(0, 10).join('<br>')}
                \\\${article.final_content.split('\\\\\\\\n').length > 10 ? '<br><em>...\u5185\u5BB9\u5DF2\u622A\u65AD</em>' : ''}
              </div>
            </div>\\\` : ''}
          </div>
          
          <div class="mt-6 flex justify-end space-x-2">
            \\\${article.editor_action === 'adopted' ? \\\`
              <a href="/workbench?article=\\\${article.id}" 
                 class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                \u270F\uFE0F \u7F16\u8F91\u6587\u7AE0
              </a>
            \\\` : ''}
            <button onclick="this.closest('.fixed').remove()" 
                    class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
              \u5173\u95ED
            </button>
          </div>
        </div>
      \\\`
      
      modal.appendChild(content)
      document.body.appendChild(modal)
    }

    // \u91CD\u7F6E\u6587\u7AE0\u64CD\u4F5C\u72B6\u6001
    async function resetArticleAction(articleId) {
      try {
        const response = await fetch('/api/articles/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: articleId,
            editor_action: null,
            status: 'processed'
          })
        })
        
        if (response.ok) {
          location.reload()
        } else {
          alert('\u91CD\u7F6E\u5931\u8D25')
        }
      } catch (error) {
        console.error('\u91CD\u7F6E\u5931\u8D25:', error)
        alert('\u91CD\u7F6E\u5931\u8D25')
      }
    }

    // \u5B58\u50A8\u6587\u7AE0\u6570\u636E\u5230\u5168\u5C40\u53D8\u91CF\u4F9B\u8BE6\u60C5\u529F\u80FD\u4F7F\u7528
    window.articlesData = articles || []
    
    // \u7ED1\u5B9A\u5230window
    window.filterArticles = filterArticles
    window.updateArticleAction = updateArticleAction
    window.resetArticleAction = resetArticleAction
    window.showArticleDetails = showArticleDetails
  })();<\/script>  `])), maybeRenderHead(), articles?.length || 0, articles?.filter((a) => a.status === "processed").length || 0, articles?.filter((a) => a.editor_action === "adopted").length || 0, articles?.filter((a) => a.editor_action === "compiled").length || 0, articles?.filter((a) => a.editor_action === "ignored").length || 0, error && renderTemplate`<div class="bg-red-100 text-red-800 p-4 rounded mb-4" data-astro-cid-xvukugm6>
错误: ${error.message} </div>`, articles?.map((article) => {
    let aiAnalysis = {};
    try {
      aiAnalysis = typeof article.ai_analysis === "string" ? JSON.parse(article.ai_analysis) : article.ai_analysis || {};
    } catch (e) {
      aiAnalysis = article.ai_analysis || {};
    }
    const valueScore = aiAnalysis.value_score || 0;
    const title = article.raw_content?.headline || article.raw_content?.title || "\u65E0\u6807\u9898";
    const summary = aiAnalysis.initial_translation || aiAnalysis.summary || article.raw_content?.summary || "\u6682\u65E0\u6458\u8981";
    return renderTemplate`<div${addAttribute(`article-item bg-white rounded-lg shadow-md p-6 ${article.editor_action === "adopted" ? "border-l-4 border-green-500" : article.editor_action === "ignored" ? "border-l-4 border-red-500" : article.status === "processed" ? "border-l-4 border-blue-500" : "border-l-4 border-gray-300"}`, "class")}${addAttribute(article.status, "data-status")}${addAttribute(article.editor_action || "", "data-editor-action")} data-astro-cid-xvukugm6> <div class="flex items-start justify-between" data-astro-cid-xvukugm6> <div class="flex-1 min-w-0" data-astro-cid-xvukugm6> <!-- 标题和评分 --> <div class="flex items-center gap-3 mb-3" data-astro-cid-xvukugm6> <h3 class="font-semibold text-lg text-gray-900 flex-1 line-clamp-2" data-astro-cid-xvukugm6> ${title} </h3> ${valueScore > 0 && renderTemplate`<span${addAttribute(`px-3 py-1 rounded-full text-sm font-bold ${valueScore >= 8 ? "bg-green-100 text-green-800" : valueScore >= 6 ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-700"}`, "class")} data-astro-cid-xvukugm6> ${valueScore}/10
</span>`} </div> <!-- 摘要 --> ${renderTemplate`<p class="text-gray-600 text-sm mb-3 line-clamp-3" data-astro-cid-xvukugm6> ${summary.substring(0, 200)}...
</p>`} <!-- 元信息 --> <div class="flex items-center space-x-4 text-xs text-gray-500 mb-4" data-astro-cid-xvukugm6> <span data-astro-cid-xvukugm6>📅 ${new Date(article.created_at).toLocaleDateString("zh-CN")}</span> <span${addAttribute(`px-2 py-1 rounded ${article.status === "processed" ? "bg-green-100 text-green-800" : article.status === "new" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`, "class")} data-astro-cid-xvukugm6> ${article.status} </span> ${article.editor_action && renderTemplate`<span${addAttribute(`px-2 py-1 rounded ${article.editor_action === "adopted" ? "bg-green-100 text-green-800" : article.editor_action === "ignored" ? "bg-red-100 text-red-800" : article.editor_action === "compiled" ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-800"}`, "class")} data-astro-cid-xvukugm6> ${article.editor_action} </span>`} <a${addAttribute(article.source_url, "href")} target="_blank" class="text-blue-600 hover:underline" data-astro-cid-xvukugm6>
🔗 原文链接
</a> </div> <!-- 操作按钮 --> <div class="flex space-x-2" data-astro-cid-xvukugm6>  ${article.status === "processed" && !article.editor_action && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-xvukugm6": true }, { "default": async ($$result3) => renderTemplate` <button${addAttribute(`updateArticleAction('${article.id}', 'adopted')`, "onclick")} class="px-4 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors" data-astro-cid-xvukugm6>
✅ 采用
</button> <button${addAttribute(`updateArticleAction('${article.id}', 'ignored')`, "onclick")} class="px-4 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors" data-astro-cid-xvukugm6>
❌ 忽略
</button> ` })}`}  ${article.editor_action && article.editor_action !== "compiled" && renderTemplate`<button${addAttribute(`resetArticleAction('${article.id}')`, "onclick")} class="px-3 py-2 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600 transition-colors" data-astro-cid-xvukugm6>
🔄 重置
</button>`}  ${article.editor_action === "adopted" && renderTemplate`<a${addAttribute(`/workbench?article=${article.id}`, "href")} class="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors" data-astro-cid-xvukugm6>
✏️ 编辑
</a>`} <button${addAttribute(`showArticleDetails('${article.id}')`, "onclick")} class="px-4 py-2 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors" data-astro-cid-xvukugm6>
📄 详情
</button> </div> </div> </div> </div>`;
  }), (!articles || articles.length === 0) && renderTemplate`<div class="text-center py-8" data-astro-cid-xvukugm6> <p class="text-gray-500" data-astro-cid-xvukugm6>暂无文章数据</p> </div>`, defineScriptVars({ articles })) })}`;
}, "/Users/simianwang/Desktop/latest-feed/src/pages/articles.astro", void 0);

const $$file = "/Users/simianwang/Desktop/latest-feed/src/pages/articles.astro";
const $$url = "/articles";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Articles,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
