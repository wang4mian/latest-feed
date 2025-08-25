export { renderers } from '../../renderers.mjs';

const GET = async () => {
  const diagnostics = {
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    status: "debug",
    environment: {
      node_version: process.version,
      platform: process.platform,
      memory: process.memoryUsage(),
      env_vars: {
        has_supabase_url: !!process.env.SUPABASE_URL,
        has_supabase_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        has_crawl4ai_key: !!process.env.CRAWL4AI_API_KEY,
        node_env: process.env.NODE_ENV
      }
    }
  };
  try {
    return new Response(JSON.stringify(diagnostics, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: "Debug endpoint failed",
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : void 0
    }, null, 2), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
