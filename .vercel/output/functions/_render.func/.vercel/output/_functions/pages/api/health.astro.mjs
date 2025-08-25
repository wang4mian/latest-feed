export { renderers } from '../../renderers.mjs';

const GET = async () => {
  try {
    const health = {
      status: "ok",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      environment: {
        node_version: process.version,
        runtime: "nodejs",
        has_supabase_url: !!process.env.SUPABASE_URL,
        has_supabase_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        has_crawl4ai_key: !!process.env.CRAWL4AI_API_KEY,
        has_gemini_key: !!process.env.GEMINI_API_KEY
      }
    };
    return new Response(JSON.stringify(health, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("[Health Check] Error:", error);
    return new Response(JSON.stringify({
      status: "error",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : void 0
    }, null, 2), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
