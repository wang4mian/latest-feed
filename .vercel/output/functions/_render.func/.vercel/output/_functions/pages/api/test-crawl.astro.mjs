import { g as getActiveRSSSources } from '../../chunks/rss-sources_BBGHTes5.mjs';
import { A as AIProcessor } from '../../chunks/ai-processor_0sFIcAI9.mjs';
import { s as supabase } from '../../chunks/supabase_DhlB0YS7.mjs';
export { renderers } from '../../renderers.mjs';

const GET = async ({ url }) => {
  const searchParams = new URL(url).searchParams;
  const action = searchParams.get("action");
  if (action === "health") {
    const activeSources = getActiveRSSSources();
    return new Response(JSON.stringify({
      success: true,
      data: {
        total_sources: activeSources.length,
        active_sources: activeSources.length,
        categories: ["Technology", "Business", "Policy"],
        status: "healthy"
      }
    }), {
      headers: { "Content-Type": "application/json" }
    });
  }
  return new Response(JSON.stringify({
    success: false,
    error: "未知的action参数"
  }), {
    status: 400,
    headers: { "Content-Type": "application/json" }
  });
};
const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const { url } = body;
    if (!url) {
      return new Response(JSON.stringify({
        success: false,
        error: "URL不能为空"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const processingResult = await AIProcessor.processArticle(url, false);
    if (processingResult.success && processingResult.article) {
      const { data, error } = await supabase.from("articles").insert([processingResult.article]).select().single();
      if (error) {
        return new Response(JSON.stringify({
          success: false,
          error: "数据库存储失败: " + error.message,
          processing_result: processingResult
        }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
      return new Response(JSON.stringify({
        success: true,
        message: "文章处理完成",
        article: data,
        processing_time: processingResult.processing_time
      }), {
        headers: { "Content-Type": "application/json" }
      });
    } else {
      return new Response(JSON.stringify({
        success: false,
        error: processingResult.error,
        processing_time: processingResult.processing_time
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : "未知错误"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
