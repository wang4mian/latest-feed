import { g as getWorkbenchArticles } from '../../chunks/supabase_DhlB0YS7.mjs';
export { renderers } from '../../renderers.mjs';

const GET = async ({ url }) => {
  try {
    const searchParams = new URL(url).searchParams;
    const status = searchParams.getAll("status");
    const category = searchParams.get("category");
    const sort_by = searchParams.get("sort_by") || "created_at";
    const sort_order = searchParams.get("sort_order") || "desc";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const filters = {
      status: status.length > 0 ? status : ["adopted"],
      ...category && { category },
      sort_by,
      sort_order
    };
    const { data: articles, error } = await getWorkbenchArticles(filters, page, limit);
    if (error) {
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const totalCount = articles?.length || 0;
    return new Response(JSON.stringify({
      success: true,
      data: {
        articles: articles || [],
        pagination: {
          page,
          limit,
          total: totalCount,
          pages: Math.ceil(totalCount / limit)
        },
        filters
      }
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
    const { action, data } = body;
    switch (action) {
      case "batch_update_status":
        return await batchUpdateStatus(data);
      case "get_statistics":
        return await getWorkbenchStatistics();
      default:
        return new Response(JSON.stringify({
          success: false,
          error: "未知的操作类型"
        }), {
          status: 400,
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
async function batchUpdateStatus(_data) {
  return new Response(JSON.stringify({
    success: true,
    data: { updated_count: 0 }
  }), {
    headers: { "Content-Type": "application/json" }
  });
}
async function getWorkbenchStatistics() {
  return new Response(JSON.stringify({
    success: true,
    data: {
      total_articles: 0,
      by_status: {},
      by_category: {},
      recent_activity: []
    }
  }), {
    headers: { "Content-Type": "application/json" }
  });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
