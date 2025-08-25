import { renderers } from './renderers.mjs';
import { c as createExports } from './chunks/entrypoint_D3gV5FHb.mjs';
import { manifest } from './manifest_HY-XFu46.mjs';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/articles/update.astro.mjs');
const _page2 = () => import('./pages/api/articles/_id_.astro.mjs');
const _page3 = () => import('./pages/api/articles.astro.mjs');
const _page4 = () => import('./pages/api/claude-test.astro.mjs');
const _page5 = () => import('./pages/api/health.astro.mjs');
const _page6 = () => import('./pages/api/process-rss.astro.mjs');
const _page7 = () => import('./pages/api/rss-sources/import.astro.mjs');
const _page8 = () => import('./pages/api/stats.astro.mjs');
const _page9 = () => import('./pages/api/test-crawl.astro.mjs');
const _page10 = () => import('./pages/api/workbench.astro.mjs');
const _page11 = () => import('./pages/articles.astro.mjs');
const _page12 = () => import('./pages/dashboard.astro.mjs');
const _page13 = () => import('./pages/rss-sources.astro.mjs');
const _page14 = () => import('./pages/test.astro.mjs');
const _page15 = () => import('./pages/workbench.astro.mjs');
const _page16 = () => import('./pages/workbench-old.astro.mjs');
const _page17 = () => import('./pages/index.astro.mjs');

const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/api/articles/update.ts", _page1],
    ["src/pages/api/articles/[id].ts", _page2],
    ["src/pages/api/articles.ts", _page3],
    ["src/pages/api/claude-test.ts", _page4],
    ["src/pages/api/health.ts", _page5],
    ["src/pages/api/process-rss.ts", _page6],
    ["src/pages/api/rss-sources/import.ts", _page7],
    ["src/pages/api/stats.ts", _page8],
    ["src/pages/api/test-crawl.ts", _page9],
    ["src/pages/api/workbench.ts", _page10],
    ["src/pages/articles.astro", _page11],
    ["src/pages/dashboard.astro", _page12],
    ["src/pages/rss-sources.astro", _page13],
    ["src/pages/test.astro", _page14],
    ["src/pages/workbench.astro", _page15],
    ["src/pages/workbench-old.astro", _page16],
    ["src/pages/index.astro", _page17]
]);
const serverIslandMap = new Map();
const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "493c89cc-a7aa-4464-9ea2-158358c4266f",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;

export { __astrojsSsrVirtualEntry as default, pageMap };
