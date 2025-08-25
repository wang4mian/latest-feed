import { renderers } from './renderers.mjs';
import { c as createExports } from './chunks/entrypoint_C9XXF7ys.mjs';
import { manifest } from './manifest_iwGbfvN-.mjs';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/articles/update.astro.mjs');
const _page2 = () => import('./pages/api/articles/_id_.astro.mjs');
const _page3 = () => import('./pages/api/articles.astro.mjs');
const _page4 = () => import('./pages/api/claude-test.astro.mjs');
const _page5 = () => import('./pages/api/debug.astro.mjs');
const _page6 = () => import('./pages/api/fetch-rss.astro.mjs');
const _page7 = () => import('./pages/api/health.astro.mjs');
const _page8 = () => import('./pages/api/init-rss-sources.astro.mjs');
const _page9 = () => import('./pages/api/ping.astro.mjs');
const _page10 = () => import('./pages/api/process-rss.astro.mjs');
const _page11 = () => import('./pages/api/raw.astro.mjs');
const _page12 = () => import('./pages/api/rss-pipeline.astro.mjs');
const _page13 = () => import('./pages/api/rss-sources/import.astro.mjs');
const _page14 = () => import('./pages/api/stats.astro.mjs');
const _page15 = () => import('./pages/api/test-crawl.astro.mjs');
const _page16 = () => import('./pages/api/workbench.astro.mjs');
const _page17 = () => import('./pages/articles.astro.mjs');
const _page18 = () => import('./pages/dashboard.astro.mjs');
const _page19 = () => import('./pages/rss-sources.astro.mjs');
const _page20 = () => import('./pages/test.astro.mjs');
const _page21 = () => import('./pages/workbench.astro.mjs');
const _page22 = () => import('./pages/workbench-old.astro.mjs');
const _page23 = () => import('./pages/index.astro.mjs');

const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/api/articles/update.ts", _page1],
    ["src/pages/api/articles/[id].ts", _page2],
    ["src/pages/api/articles.ts", _page3],
    ["src/pages/api/claude-test.ts", _page4],
    ["src/pages/api/debug.ts", _page5],
    ["src/pages/api/fetch-rss.ts", _page6],
    ["src/pages/api/health.ts", _page7],
    ["src/pages/api/init-rss-sources.ts", _page8],
    ["src/pages/api/ping.ts", _page9],
    ["src/pages/api/process-rss.ts", _page10],
    ["src/pages/api/raw.ts", _page11],
    ["src/pages/api/rss-pipeline.ts", _page12],
    ["src/pages/api/rss-sources/import.ts", _page13],
    ["src/pages/api/stats.ts", _page14],
    ["src/pages/api/test-crawl.ts", _page15],
    ["src/pages/api/workbench.ts", _page16],
    ["src/pages/articles.astro", _page17],
    ["src/pages/dashboard.astro", _page18],
    ["src/pages/rss-sources.astro", _page19],
    ["src/pages/test.astro", _page20],
    ["src/pages/workbench.astro", _page21],
    ["src/pages/workbench-old.astro", _page22],
    ["src/pages/index.astro", _page23]
]);
const serverIslandMap = new Map();
const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "75006c61-df96-4379-81f7-ec144252c05f",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;

export { __astrojsSsrVirtualEntry as default, pageMap };
