import 'cookie';
import 'kleur/colors';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_BHgClshW.mjs';
import 'es-module-lexer';
import { h as decodeKey } from './chunks/astro/server_0DBvwa-7.mjs';
import 'clsx';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///Users/simianwang/Desktop/latest-feed/","adapterName":"@astrojs/vercel/serverless","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/articles/update","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/articles\\/update\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"articles","dynamic":false,"spread":false}],[{"content":"update","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/articles/update.ts","pathname":"/api/articles/update","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/articles/[id]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/articles\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"articles","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/api/articles/[id].ts","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/articles","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/articles\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"articles","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/articles.ts","pathname":"/api/articles","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/claude-test","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/claude-test\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"claude-test","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/claude-test.ts","pathname":"/api/claude-test","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/process-rss","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/process-rss\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"process-rss","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/process-rss.ts","pathname":"/api/process-rss","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/rss-sources/import","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/rss-sources\\/import\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"rss-sources","dynamic":false,"spread":false}],[{"content":"import","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/rss-sources/import.ts","pathname":"/api/rss-sources/import","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/stats","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/stats\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"stats","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/stats.ts","pathname":"/api/stats","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/test-crawl","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/test-crawl\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"test-crawl","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/test-crawl.ts","pathname":"/api/test-crawl","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/workbench","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/workbench\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"workbench","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/workbench.ts","pathname":"/api/workbench","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/articles.CqRiBkXb.css"},{"type":"inline","content":".line-clamp-2[data-astro-cid-xvukugm6]{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.line-clamp-3[data-astro-cid-xvukugm6]{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}.filter-btn[data-astro-cid-xvukugm6].active{background-color:#3b82f6!important;color:#fff!important}.transition-colors[data-astro-cid-xvukugm6]{transition:background-color .2s ease-in-out}\n"}],"routeData":{"route":"/articles","isIndex":false,"type":"page","pattern":"^\\/articles\\/?$","segments":[[{"content":"articles","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/articles.astro","pathname":"/articles","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"inline","value":"document.getElementById(\"refresh-stats\")?.addEventListener(\"click\",async()=>{const e=document.getElementById(\"refresh-stats\");e&&(e.innerHTML='<div class=\"text-center\"><span class=\"text-3xl mb-2 block\">⏳</span><p class=\"font-medium text-gray-900\">刷新中...</p></div>'),setTimeout(()=>{window.location.reload()},1e3)});\n"}],"styles":[{"type":"external","src":"/_astro/articles.CqRiBkXb.css"},{"type":"inline","content":".line-clamp-2[data-astro-cid-3nssi2tu]{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.transition-all[data-astro-cid-3nssi2tu]{transition:all .2s ease-in-out}.hover\\:shadow-md[data-astro-cid-3nssi2tu]:hover{box-shadow:0 4px 6px -1px #0000001a,0 2px 4px -1px #0000000f}\n"}],"routeData":{"route":"/dashboard","isIndex":false,"type":"page","pattern":"^\\/dashboard\\/?$","segments":[[{"content":"dashboard","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/dashboard.astro","pathname":"/dashboard","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/articles.CqRiBkXb.css"}],"routeData":{"route":"/rss-sources","isIndex":false,"type":"page","pattern":"^\\/rss-sources\\/?$","segments":[[{"content":"rss-sources","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/rss-sources.astro","pathname":"/rss-sources","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/articles.CqRiBkXb.css"}],"routeData":{"route":"/test","isIndex":false,"type":"page","pattern":"^\\/test\\/?$","segments":[[{"content":"test","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/test.astro","pathname":"/test","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/articles.CqRiBkXb.css"},{"type":"inline","content":".line-clamp-2[data-astro-cid-nldvb3f7]{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}\n"}],"routeData":{"route":"/workbench","isIndex":false,"type":"page","pattern":"^\\/workbench\\/?$","segments":[[{"content":"workbench","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/workbench.astro","pathname":"/workbench","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"inline","value":"let c=null;async function s(t){c=t;try{const o=await(await fetch(`/api/articles/${t}`)).json();if(o.success){const n=o.data,r=n.final_content||n.ai_translation||\"\";document.getElementById(\"editor-modal\").classList.remove(\"hidden\");const a=document.getElementById(\"editor-iframe\");a.onload=function(){a.contentWindow.postMessage({source:\"parent\",action:\"setContent\",data:r},\"*\")}}}catch(e){console.error(\"加载文章失败:\",e)}}function i(){document.getElementById(\"editor-modal\").classList.add(\"hidden\"),c=null}async function d(){document.getElementById(\"editor-iframe\").contentWindow.postMessage({source:\"parent\",action:\"getContent\"},\"*\")}async function l(){if(!c)return;const t=document.getElementById(\"hidden-content\").value;try{(await fetch(\"/api/articles/update\",{method:\"POST\",headers:{\"Content-Type\":\"application/json\"},body:JSON.stringify({id:c,final_content:t,status:\"compiled\",editor_action:\"compiled\"})})).ok&&(alert(\"保存成功！\"),i(),location.reload())}catch(e){console.error(\"保存失败:\",e),alert(\"保存失败\")}}window.addEventListener(\"message\",t=>{t.data.source===\"doocs-editor\"&&t.data.action===\"contentResponse\"&&(document.getElementById(\"hidden-content\").value=t.data.data,alert(\"内容已同步\"))});document.getElementById(\"apply-filters\").addEventListener(\"click\",()=>{const t=document.getElementById(\"status-filter\").value,e=document.getElementById(\"category-filter\").value,o=document.getElementById(\"sort-filter\").value,n=new URLSearchParams;t!==\"all\"&&n.append(\"status\",t),e!==\"all\"&&n.append(\"category\",e);const[r,a]=o.split(\"_\");n.append(\"sort_by\",r),n.append(\"sort_order\",a),window.location.href=`/workbench?${n.toString()}`});async function m(t){try{(await fetch(\"/api/articles/update\",{method:\"POST\",headers:{\"Content-Type\":\"application/json\"},body:JSON.stringify({id:t,status:\"compiled\",editor_action:\"compiled\"})})).ok&&location.reload()}catch(e){console.error(\"标记编译失败:\",e)}}window.editArticle=s;window.markCompiled=m;window.closeEditor=i;window.syncContent=d;window.saveArticle=l;\n"}],"styles":[{"type":"external","src":"/_astro/articles.CqRiBkXb.css"}],"routeData":{"route":"/workbench-old","isIndex":false,"type":"page","pattern":"^\\/workbench-old\\/?$","segments":[[{"content":"workbench-old","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/workbench-old.astro","pathname":"/workbench-old","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"inline","value":"\n"}],"styles":[{"type":"external","src":"/_astro/articles.CqRiBkXb.css"},{"type":"inline","content":".category-tab[data-astro-cid-j7pv25f6].active{--tw-border-opacity: 1;border-color:rgb(15 76 129 / var(--tw-border-opacity, 1));--tw-text-opacity: 1;color:rgb(15 76 129 / var(--tw-text-opacity, 1))}\n"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/Users/simianwang/Desktop/latest-feed/src/pages/articles.astro",{"propagation":"none","containsHead":true}],["/Users/simianwang/Desktop/latest-feed/src/pages/dashboard.astro",{"propagation":"none","containsHead":true}],["/Users/simianwang/Desktop/latest-feed/src/pages/index.astro",{"propagation":"none","containsHead":true}],["/Users/simianwang/Desktop/latest-feed/src/pages/rss-sources.astro",{"propagation":"none","containsHead":true}],["/Users/simianwang/Desktop/latest-feed/src/pages/test.astro",{"propagation":"none","containsHead":true}],["/Users/simianwang/Desktop/latest-feed/src/pages/workbench-old.astro",{"propagation":"none","containsHead":true}],["/Users/simianwang/Desktop/latest-feed/src/pages/workbench.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(o,t)=>{let i=async()=>{await(await o())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000noop-middleware":"_noop-middleware.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:src/pages/api/articles/update@_@ts":"pages/api/articles/update.astro.mjs","\u0000@astro-page:src/pages/api/articles/[id]@_@ts":"pages/api/articles/_id_.astro.mjs","\u0000@astro-page:src/pages/api/articles@_@ts":"pages/api/articles.astro.mjs","\u0000@astro-page:src/pages/api/claude-test@_@ts":"pages/api/claude-test.astro.mjs","\u0000@astro-page:src/pages/api/process-rss@_@ts":"pages/api/process-rss.astro.mjs","\u0000@astro-page:src/pages/api/rss-sources/import@_@ts":"pages/api/rss-sources/import.astro.mjs","\u0000@astro-page:src/pages/api/stats@_@ts":"pages/api/stats.astro.mjs","\u0000@astro-page:src/pages/api/workbench@_@ts":"pages/api/workbench.astro.mjs","\u0000@astro-page:src/pages/articles@_@astro":"pages/articles.astro.mjs","\u0000@astro-page:src/pages/dashboard@_@astro":"pages/dashboard.astro.mjs","\u0000@astro-page:src/pages/rss-sources@_@astro":"pages/rss-sources.astro.mjs","\u0000@astro-page:src/pages/test@_@astro":"pages/test.astro.mjs","\u0000@astro-page:src/pages/workbench@_@astro":"pages/workbench.astro.mjs","\u0000@astro-page:src/pages/workbench-old@_@astro":"pages/workbench-old.astro.mjs","\u0000@astro-page:src/pages/api/test-crawl@_@ts":"pages/api/test-crawl.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","/Users/simianwang/Desktop/latest-feed/node_modules/astro/dist/env/setup.js":"chunks/astro/env-setup_Cr6XTFvb.mjs","\u0000@astrojs-manifest":"manifest_S5edWuRv.mjs","/astro/hoisted.js?q=1":"_astro/hoisted.l0sNRNKZ.js","/astro/hoisted.js?q=0":"_astro/hoisted.D2fE_d1a.js","/astro/hoisted.js?q=2":"_astro/hoisted.6LMDxvGp.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/articles.CqRiBkXb.css","/doocs-editor.html"],"buildFormat":"directory","checkOrigin":false,"serverIslandNameMap":[],"key":"OPU9oly+BrOdZHGSFemFWUtLw84KyIN6GRWeVKRICVw=","experimentalEnvGetSecretEnabled":false});

export { manifest };
