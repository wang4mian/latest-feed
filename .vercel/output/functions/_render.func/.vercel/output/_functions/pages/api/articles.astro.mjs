import { s as supabase } from '../../chunks/supabase_Dfi1qjCo.mjs';
export { renderers } from '../../renderers.mjs';

const GET = async ({ url, request }) => {
  try {
    const searchParams = new URL(request.url).searchParams;
    const category = searchParams.get("category");
    let query = supabase.from("articles").select("*").eq("status", "processed").order("value_score", { ascending: false }).limit(20);
    if (category && category !== "all") {
      const { data: categoryRssSources } = await supabase.from("rss_sources").select("url").eq("category", category).eq("is_active", true);
      if (categoryRssSources && categoryRssSources.length > 0) {
        const validSourceUrls = categoryRssSources.map((source) => source.url);
        const orConditions = validSourceUrls.map((url2) => `raw_content->>source_url.eq.${url2}`).join(",");
        query = query.or(orConditions);
      }
    }
    const { data: articles, error } = await query;
    if (error) {
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({
      success: true,
      data: articles || []
    }), {
      headers: { "Content-Type": "application/json" }
    });
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
const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const { ids } = body;
    if (!ids || !Array.isArray(ids)) {
      return new Response(JSON.stringify({
        success: false,
        error: "无效的文章ID列表"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { data, error } = await supabase.from("articles").select("*").in("id", ids);
    if (error) {
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({
      success: true,
      data: data || []
    }), {
      headers: { "Content-Type": "application/json" }
    });
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
