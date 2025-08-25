import { s as supabase } from '../../../chunks/supabase_X1KeQV3a.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const { sources } = body;
    if (!sources || !Array.isArray(sources)) {
      return new Response(JSON.stringify({
        success: false,
        error: "无效的RSS源数据"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { data, error } = await supabase.from("rss_sources").upsert(sources, {
      onConflict: "id",
      ignoreDuplicates: false
    }).select();
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
      data: {
        imported_count: data?.length || 0,
        message: `成功导入 ${data?.length || 0} 个RSS源`
      }
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : "导入失败"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
